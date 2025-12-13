import { getHomeownerDashboardStats, getCompanyDashboardStats, getCityDashboardStats } from '../../src/services/dashboard';
import { prismaClient } from '../../src/db';

jest.mock('../../src/db', () => ({
  prismaClient: {
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    offer: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    companyProfile: {
      findUnique: jest.fn(),
    },
    cityProfile: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Dashboard Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHomeownerDashboardStats', () => {
    it('should return correct stats for homeowner', async () => {
      (prismaClient.post.count as jest.Mock).mockResolvedValue(5);
      (prismaClient.project.count as jest.Mock)
        .mockResolvedValueOnce(2) // active projects
        .mockResolvedValueOnce(3); // completed projects
      (prismaClient.offer.count as jest.Mock).mockResolvedValue(4);
      (prismaClient.project.findMany as jest.Mock).mockResolvedValue([]);
      (prismaClient.post.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getHomeownerDashboardStats('user1');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data.stats.totalPosts).toBe(5);
      expect(result.data.stats.activeProjects).toBe(2);
      expect(result.data.stats.completedProjects).toBe(3);
      expect(result.data.stats.pendingOffers).toBe(4);
    });
  });

  describe('getCompanyDashboardStats', () => {
    it('should return error if company profile not found', async () => {
      (prismaClient.companyProfile.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getCompanyDashboardStats('user1');

      expect(result.error).toBe("Company profile not found");
    });

    it('should return correct stats for company', async () => {
      const mockCompany = { id: 'company1', companyName: 'Test Corp', description: 'Test', verified: true };
      
      (prismaClient.companyProfile.findUnique as jest.Mock).mockResolvedValue(mockCompany);
      (prismaClient.offer.count as jest.Mock)
        .mockResolvedValueOnce(5) // active offers
        .mockResolvedValueOnce(3); // pending offers
      (prismaClient.post.count as jest.Mock).mockResolvedValue(10);
      (prismaClient.offer.findMany as jest.Mock).mockResolvedValue([]);
      (prismaClient.post.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getCompanyDashboardStats('user1');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data.companyInfo).toEqual(mockCompany);
      expect(result.data.stats.activeOffers).toBe(5);
      expect(result.data.stats.totalPosts).toBe(10);
    });
  });

  describe('getCityDashboardStats', () => {
    it('should return error if city profile not found', async () => {
      (prismaClient.cityProfile.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getCityDashboardStats('user1');

      expect(result.error).toBe("City profile not found");
    });

    it('should return correct stats for city', async () => {
      const mockCity = { id: 'city1', cityName: 'Test City', description: 'Test', verified: true };
      
      (prismaClient.cityProfile.findUnique as jest.Mock).mockResolvedValue(mockCity);
      (prismaClient.post.count as jest.Mock)
        .mockResolvedValueOnce(20) // total posts
        .mockResolvedValueOnce(2); // hazardous materials
      (prismaClient.offer.count as jest.Mock)
        .mockResolvedValueOnce(15) // materials recycled
        .mockResolvedValueOnce(8); // active pickups
      (prismaClient.post.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getCityDashboardStats('user1');

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data.cityInfo).toEqual(mockCity);
      expect(result.data.stats.totalPosts).toBe(20);
      expect(result.data.stats.materialsRecycled).toBe(15);
    });
  });
});

