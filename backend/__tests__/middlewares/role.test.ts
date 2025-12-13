import requireRole from '../../src/middlewares/role';
import { getUserRole } from '../../src/services/user';

jest.mock('../../src/services/user', () => ({
  getUserRole: jest.fn(),
}));

describe('requireRole middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user1' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should allow access for correct role', async () => {
    (getUserRole as jest.Mock).mockResolvedValue('HOMEOWNER');

    const middleware = requireRole(['HOMEOWNER', 'COMPANY']);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should deny access for incorrect role', async () => {
    (getUserRole as jest.Mock).mockResolvedValue('CITY');

    const middleware = requireRole(['HOMEOWNER', 'COMPANY']);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Access denied" });
  });

  it('should return 401 if no user', async () => {
    mockReq.user = null;

    const middleware = requireRole(['HOMEOWNER']);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});

