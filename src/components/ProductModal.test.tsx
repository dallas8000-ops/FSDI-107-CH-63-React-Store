import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductModal from './ProductModal';

describe('ProductModal', () => {
  it('renders nothing when product is null', () => {
    const { container } = render(<ProductModal product={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows product details and closes', () => {
    const onClose = vi.fn();
    render(
      <ProductModal
        product={{
          id: 1,
          name: 'Test Product',
          description: 'A short description',
          price: 19.99,
          image: '/images/x.jpg',
          category: 'Accessories',
          stars: 4.5,
        }}
        onClose={onClose}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Product' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
