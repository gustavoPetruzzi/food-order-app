import { useRef, useState } from 'react';
import classes from './Checkout.module.css';

const isEmpty  = (value) => value.trim() === '';
const isFiveChars = (value) => value.trim().length === 5;

const Checkout = (props) => {
  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalInputRef = useRef();
  const cityInputRef = useRef();
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    postal: true
  });

  const confirmHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredPostal = postalInputRef.current.value;
    const enteredCity = cityInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredPostalIsValid = isFiveChars(enteredPostal);
    
    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      city: enteredCityIsValid,
      postal: enteredPostalIsValid
    });


    const formIsValid = 
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredCityIsValid && 
      enteredPostalIsValid;


    if (formIsValid) {
      props.onSubmit({
        name: enteredName,
        street: enteredStreet,
        city: enteredCity,
        postal: enteredPostal
      })
      return;
    }
  };

  /**
   * Generates form control classes.
   * @param {string} state - The current state for generating classes
   * @returns {string} A string with the expected classes
   */
  const getControlClasses = state => {
    return `${classes.control} ${formInputsValidity[state] ? '' : classes.invalid}`;
  }

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={getControlClasses('name')}>
        <label htmlFor='name'>Your Name</label>
        <input type='text' id='name' ref={nameInputRef} />
        { !formInputsValidity.name && <p> Please enter a valid name </p>}
      </div>
      <div className={getControlClasses('street')}>
        <label htmlFor='street'>Street</label>
        <input type='text' id='street' ref={streetInputRef} />
        { !formInputsValidity.street && <p> Please enter a valid street </p>}
      </div>
      <div className={getControlClasses('postal')}>
        <label htmlFor='postal'>Postal Code</label>
        <input type='text' id='postal' ref={postalInputRef} />
        { !formInputsValidity.postal && <p> Please enter a valid postal code </p>}

      </div>
      <div className={getControlClasses('city')}>
        <label htmlFor='city'>City</label>
        <input type='text' id='city' ref={cityInputRef} />
        { !formInputsValidity.city && <p> Please enter a valid city </p>}

      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;