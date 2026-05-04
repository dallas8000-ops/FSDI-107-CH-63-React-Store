/** Catalog / cart line item shape used across the app */
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description: string;
  category: string;
  stars: number;
  oldPrice: number | null;
  discount: number | null;
  date?: string;
}

export interface CartLine extends Product {
  quantity: number;
}

export interface GlobalContextValue {
  cart: CartLine[];
  user: { name: string };
  addProductToCart: (product: Product | CartLine) => void;
  clearCart: () => void;
  removeProductFromCart: (productId: number | string) => void;
  updateCartItemQuantity: (productId: number | string, newQuantity: number) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
