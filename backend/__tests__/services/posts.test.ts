import { createPost, searchPosts } from '../../src/services/posts';
import { prismaClient } from '../../src/db';
import { PostType, PostStatus } from '@prisma/client';

jest.mock('../../src/db', () => ({
  prismaClient: {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    postAuditLog: {
      create: jest.fn(),
    },
  },
}));

describe('Posts Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create post successfully', async () => {
      const mockPost = {
        id: 'post1',
        type: PostType.MATERIAL,
        title: 'Test Post',
        status: PostStatus.AVAILABLE,
        userId: 'user1',
        images: ['image1.jpg', 'image2.jpg'],
      };

      (prismaClient.post.create as jest.Mock).mockResolvedValue(mockPost);
      (prismaClient.postAuditLog.create as jest.Mock).mockResolvedValue({});

      const result = await createPost({
        type: PostType.MATERIAL,
        title: 'Test Post',
        subtype: 'tiles',
        latitude: 38.7223,
        longitude: -9.1393,
        pickupAllowed: true,
        transportNeeded: false,
        canCompanyCollect: true,
        permitForReuse: true,
        hazardousMaterials: false,
        structuralItems: false,
        images: ['image1.jpg', 'image2.jpg'],
        userId: 'user1',
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(mockPost);
      expect(prismaClient.post.create).toHaveBeenCalled();
      expect(prismaClient.postAuditLog.create).toHaveBeenCalled();
    });
  });

  describe('searchPosts', () => {
    it('should search posts with geolocation', async () => {
      const mockPosts = [
        {
          id: 'post1',
          title: 'Post 1',
          latitude: 38.7223,
          longitude: -9.1393,
          _count: { offers: 0 },
        },
      ];

      (prismaClient.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
      (prismaClient.post.count as jest.Mock).mockResolvedValue(1);

      const result = await searchPosts({
        query: 'tiles',
        latitude: 38.7223,
        longitude: -9.1393,
        radius: 10,
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1);
    });
  });
});

