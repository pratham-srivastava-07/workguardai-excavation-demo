import { render, screen } from '@testing-library/react';
import { PostDetail } from '@/components/map/post-detail';

const mockPost = {
  id: 'post1',
  type: 'MATERIAL' as const,
  title: 'Test Post',
  description: 'Test description',
  subtype: 'tiles',
  quantity: 10,
  unit: 'm²',
  price: 10000,
  latitude: 38.7223,
  longitude: -9.1393,
  address: 'Test Address',
  condition: 'used',
  status: 'AVAILABLE',
  user: { id: 'user1', name: 'Test User', email: 'test@test.com' },
};

describe('PostDetail', () => {
  it('should hide Make Offer button for own post', () => {
    const { container } = render(
      <PostDetail
        post={{ ...mockPost, userId: 'user1' }}
        showOfferButton={false}
        isAuthenticated={true}
      />
    );

    expect(container.querySelector('button:has-text("Make an Offer")')).not.toBeInTheDocument();
  });

  it('should show Make Offer button for other user post', () => {
    render(
      <PostDetail
        post={{ ...mockPost, userId: 'user2' }}
        showOfferButton={true}
        isAuthenticated={true}
        onMakeOffer={jest.fn()}
      />
    );

    expect(screen.getByText('Make an Offer')).toBeInTheDocument();
  });

  it('should display post information correctly', () => {
    render(
      <PostDetail
        post={mockPost}
        isAuthenticated={true}
      />
    );

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('€100.00')).toBeInTheDocument();
  });
});

