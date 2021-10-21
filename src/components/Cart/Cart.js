import { useContext, useState } from 'react/cjs/react.development';
import CartContext from '../../store/cart-context';
import Modal from '../UI/Modal/Modal';
import classes from './Cart.module.css';
import CartItem from './CartItem/CartItem';
import Checkout from './Checkout/Checkout';
import useHttp from '../../hooks/use-http';
const Cart = props => {
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const [isCheckout, setCheckout] = useState(false);
  const { isLoading, error, sendRequest: sendCheckoutPost} = useHttp();
  const [didSubmit, setDidSubmit] = useState(false);
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
    setDidSubmit(false);
    sendCheckoutPost(
      {
        url: 'https://react-http-313f1-default-rtdb.firebaseio.com/order.json',
        method: 'POST',
        body: {
          user: userData,
          orderedItem: cartCtx.items
        }
      },
      (response) => {
        setDidSubmit(true);
        cartCtx.clearCart();
      },
    );
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

  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span> Total Amount: </span>
        <span> { totalAmount }</span>
      </div>
      { isCheckout && <Checkout onSubmit={submitOrderHandler} onCancel={props.onClose} /> }
      { !isCheckout && modalActions }
    </>
  )

  const isSubmittingModalContent = (
    <>
      <p> Sending order data... </p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}> Close </button>
      </div>

    </>
  )
  const didSubmitModalContent = <p> Successfully sent the order </p>;
  return (
    <Modal onClose={props.onClose}>
      { !isLoading && !didSubmit && cartModalContent }
      { isLoading &&  isSubmittingModalContent }
      { !isLoading && didSubmit && didSubmitModalContent }
    </Modal>
  )
}

export default Cart;