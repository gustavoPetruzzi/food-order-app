import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  const actionHandler = {
    'ADD': () => {
      
      const existingCartItemIndex = state.items.findIndex(item => item.id === action.item.id);
      const existingCartItem = state.items[existingCartItemIndex];
      let updatedItems;

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.item.amount
        }
        console.log(updatedItem);
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }
      console.log(updatedItems);
      const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount
      }
    },
    'REMOVE': () => {
      const existingCartItemIndex = state.items.findIndex(item => item.id === action.id);
      const existingItem = state.items[existingCartItemIndex];
      const updatedTotalAmount = state.totalAmount - existingItem.price;
      let updatedItems;
      if (existingItem.amount === 1) {
        updatedItems = state.items.filter(item => item.id !== action.id);
      } else {
        const updatedItem = {...existingItem, amount: existingItem.amount - 1 };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount
      }
   
    },
    'CLEAR': () => {
      return defaultCartState;
    }
  }

  return actionHandler[action.type]();
}
const CartProvider = (props) => {

  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

  const addItemToCartHandler = item => {
    dispatchCartAction( {type: 'ADD', item });
  };

  const removeItemFromCartHandler = id => {
    dispatchCartAction( {type: 'REMOVE', id})
  };

  const clearCartHandler = () => {
    dispatchCartAction( { type: 'CLEAR' });
  }

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler
  }
  return (
    <CartContext.Provider value={cartContext}>
      { props.children }
    </CartContext.Provider>
  )
}

export default CartProvider;