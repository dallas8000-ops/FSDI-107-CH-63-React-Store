import { createContext } from 'react';
import type { GlobalContextValue } from '../types/models';

const noop = () => {};

const defaultValue: GlobalContextValue = {
  cart: [],
  user: { name: '' },
  addProductToCart: noop as GlobalContextValue['addProductToCart'],
  clearCart: noop,
  removeProductFromCart: noop as GlobalContextValue['removeProductFromCart'],
  updateCartItemQuantity: noop as GlobalContextValue['updateCartItemQuantity'],
  isCartOpen: false,
  openCart: noop,
  closeCart: noop,
};

const GlobalContext = createContext<GlobalContextValue>(defaultValue);

export default GlobalContext;
