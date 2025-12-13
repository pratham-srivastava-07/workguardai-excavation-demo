import { render, screen, waitFor } from '@testing-library/react';
import HomeownerDashboard from '@/components/dashboard/HomeownerDashboard';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

global.fetch = jest.fn();

describe('HomeownerDashboard', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should redirect to login if no token', async () => {
    render(<HomeownerDashboard />);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('should fetch and display dashboard data', async () => {
    const mockData = {
      stats: {
        totalPosts: 5,
        activeProjects: 2,
        pendingOffers: 3,
        completedProjects: 1,
      },
      recentProjects: [],
      recentPosts: [],
    };

    localStorage.setItem('accessToken', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<HomeownerDashboard />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    localStorage.setItem('accessToken', 'test-token');
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<HomeownerDashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });
});

