import { createOffer, updateOfferStatus, updateOffer } from '../../src/services/offers';
import { prismaClient } from '../../src/db';
import { OfferStatus } from '@prisma/client';

jest.mock('../../src/db', () => ({
  prismaClient: {
    post: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    offer: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Offers Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOffer', () => {
    it('should prevent users from making offers on their own posts', async () => {
      const mockPost = {
        id: 'post1',
        status: 'AVAILABLE',
        userId: 'user1',
      };

      (prismaClient.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

      const result = await createOffer({
        postId: 'post1',
        userId: 'user1', // Same user
        amount: 10000,
      });

      expect(result.error).toBe("You cannot make an offer on your own post");
      expect(prismaClient.offer.create).not.toHaveBeenCalled();
    });

    it('should create offer successfully for different user', async () => {
      const mockPost = {
        id: 'post1',
        status: 'AVAILABLE',
        userId: 'user1',
      };

      const mockOffer = {
        id: 'offer1',
        postId: 'post1',
        userId: 'user2',
        amount: 10000,
        status: OfferStatus.PENDING,
        post: { id: 'post1', title: 'Test Post', price: 15000 },
        user: { id: 'user2', name: 'User 2', email: 'user2@test.com' },
      };

      (prismaClient.post.findUnique as jest.Mock).mockResolvedValue(mockPost);
      (prismaClient.offer.create as jest.Mock).mockResolvedValue(mockOffer);

      const result = await createOffer({
        postId: 'post1',
        userId: 'user2',
        amount: 10000,
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(mockOffer);
      expect(prismaClient.offer.create).toHaveBeenCalled();
    });

    it('should reject offer if post is not available', async () => {
      const mockPost = {
        id: 'post1',
        status: 'RESERVED',
        userId: 'user1',
      };

      (prismaClient.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

      const result = await createOffer({
        postId: 'post1',
        userId: 'user2',
        amount: 10000,
      });

      expect(result.error).toBe("Post is not available for offers");
      expect(prismaClient.offer.create).not.toHaveBeenCalled();
    });
  });

  describe('updateOfferStatus', () => {
    it('should only allow post owner to update offer status', async () => {
      const mockOffer = {
        id: 'offer1',
        postId: 'post1',
        post: { userId: 'user1' },
      };

      (prismaClient.offer.findUnique as jest.Mock).mockResolvedValue(mockOffer);

      const result = await updateOfferStatus('offer1', 'user2', OfferStatus.ACCEPTED);

      expect(result.error).toBe("Unauthorized: You don't own this post");
      expect(prismaClient.offer.update).not.toHaveBeenCalled();
    });

    it('should mark post as reserved when offer is accepted', async () => {
      const mockOffer = {
        id: 'offer1',
        postId: 'post1',
        post: { userId: 'user1' },
      };

      const updatedOffer = {
        ...mockOffer,
        status: OfferStatus.ACCEPTED,
      };

      (prismaClient.offer.findUnique as jest.Mock).mockResolvedValue(mockOffer);
      (prismaClient.offer.update as jest.Mock).mockResolvedValue(updatedOffer);

      const result = await updateOfferStatus('offer1', 'user1', OfferStatus.ACCEPTED);

      expect(result.error).toBeUndefined();
      expect(prismaClient.post.update).toHaveBeenCalledWith({
        where: { id: 'post1' },
        data: { status: 'RESERVED' },
      });
    });
  });

  describe('updateOffer', () => {
    it('should only allow offer creator to modify offer', async () => {
      const mockOffer = {
        id: 'offer1',
        userId: 'user1',
        companyId: null,
        status: OfferStatus.PENDING,
      };

      (prismaClient.offer.findUnique as jest.Mock).mockResolvedValue(mockOffer);

      const result = await updateOffer('offer1', 'user2', { amount: 12000 });

      expect(result.error).toBe("Unauthorized: You don't own this offer");
      expect(prismaClient.offer.update).not.toHaveBeenCalled();
    });

    it('should only allow modification of pending offers', async () => {
      const mockOffer = {
        id: 'offer1',
        userId: 'user1',
        companyId: null,
        status: OfferStatus.ACCEPTED,
      };

      (prismaClient.offer.findUnique as jest.Mock).mockResolvedValue(mockOffer);

      const result = await updateOffer('offer1', 'user1', { amount: 12000 });

      expect(result.error).toBe("Can only modify pending offers");
      expect(prismaClient.offer.update).not.toHaveBeenCalled();
    });
  });
});

