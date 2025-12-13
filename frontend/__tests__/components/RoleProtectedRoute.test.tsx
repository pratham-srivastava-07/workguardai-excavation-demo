import { render, screen, waitFor } from '@testing-library/react';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RoleProtectedRoute', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should redirect to login if no token', async () => {
    render(
      <RoleProtectedRoute allowedRoles={['HOMEOWNER']}>
        <div>Protected Content</div>
      </RoleProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it('should allow access for correct role', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', role: 'HOMEOWNER' }));

    render(
      <RoleProtectedRoute allowedRoles={['HOMEOWNER']}>
        <div>Protected Content</div>
      </RoleProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('should redirect to appropriate dashboard for wrong role', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', role: 'COMPANY' }));

    render(
      <RoleProtectedRoute allowedRoles={['HOMEOWNER']}>
        <div>Protected Content</div>
      </RoleProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/company-dashboard');
    });
  });
});

