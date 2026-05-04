import { useState, type ReactNode } from 'react';
import GlobalContext from './globalContext';
import type { CartLine, Product } from '../types/models';

type GlobalProviderProps = {
  children: ReactNode;
};

function GlobalProvider({ children }: GlobalProviderProps) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [user] = useState({ name: 'Barney' });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addProductToCart = (product: Product | CartLine) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: 'quantity' in product && product.quantity ? product.quantity : item.quantity + 1,
              }
            : item
        );
      }
      const qty = 'quantity' in product && product.quantity ? product.quantity : 1;
      return [...prevCart, { ...product, quantity: qty } as CartLine];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeProductFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: number | string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <GlobalContext.Provider
      value={{
        cart,
        user,
        addProductToCart,
        clearCart,
        removeProductFromCart,
        updateCartItemQuantity,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
