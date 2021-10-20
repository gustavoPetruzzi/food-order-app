import { useContext, useState } from 'react/cjs/react.development';
import CartContext from '../../store/cart-context';
import Modal from '../UI/Modal/Modal';
import classes from './Cart.module.css';
import CartItem from './CartItem/CartItem';
import Checkout from './Checkout/Checkout';

const Cart = props => {
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const [isCheckout, setCheckout] = useState(false);
  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  }

  const cartItemAddHandler = item => {
    cartCtx.addItem( { ...item, amount: 1 });
  }
  const orderHandler = () => {
    setCheckout(true);
  }

  const submitOrderHandler = (userData) => {
    
  }

  const cartItems = (
    <ul className={classes['cart-items']}> 
      {cartCtx.items.map(item => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  
  const modalActions =(
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}> Close </button>
      {hasItems && <button className={classes.button} onClick={orderHandler} > Order </button> }
    </div>
  );
  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span> Total Amount: </span>
        <span> { totalAmount }</span>
      </div>
      { isCheckout && <Checkout onSubmit={submitOrderHandler} onCancel={props.onClose} /> }
      { !isCheckout && modalActions }
    </Modal>
  )
}

export default Cart;