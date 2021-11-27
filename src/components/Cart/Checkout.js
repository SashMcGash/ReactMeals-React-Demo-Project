import { useContext, useState } from "react";
import useInput from "../../hooks/use-input";
import CartContext from "../../store/cart-context";

import classes from "./Checkout.module.css";

const Checkout = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const validateInput = (text) => text.trim() !== "";

  const cartCtx = useContext(CartContext);

  const uploadOrder = async (name, street, city, postalCode) => {
    try {
      const address = { street, city, postalCode };
      const uploadData = { name, address, items: cartCtx.items };

      const res = await fetch(
        "https://react-http-d82d4-default-rtdb.firebaseio.com/orders.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        }
      );

      if (!res.ok) {
        throw new Error(res.message);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const {
    enteredValue: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput(validateInput);

  const {
    enteredValue: streetValue,
    isValid: streetIsValid,
    hasError: streetHasError,
    valueChangeHandler: streetChangeHandler,
    valueBlurHandler: streetBlurHandler,
    reset: streetReset,
  } = useInput(validateInput);
  const {
    enteredValue: cityValue,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandler: cityChangeHandler,
    valueBlurHandler: cityBlurHandler,
    reset: cityReset,
  } = useInput(validateInput);
  const {
    enteredValue: postalCodeValue,
    isValid: postalCodeIsValid,
    hasError: postalCodeHasError,
    valueChangeHandler: postalCodeChangeHandler,
    valueBlurHandler: postalCodeBlurHandler,
    reset: postalCodeReset,
  } = useInput(validateInput);

  let formIsValid = false;

  if (nameIsValid && streetIsValid && cityIsValid && postalCodeIsValid) {
    formIsValid = true;
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (!formIsValid) {
      nameBlurHandler();
      streetBlurHandler();
      cityBlurHandler();
      postalCodeBlurHandler();
      return;
    }

    uploadOrder(nameValue, streetValue, cityValue, postalCodeValue);

    nameReset();
    streetReset();
    cityReset();
    postalCodeReset();
    cartCtx.clearCart();

    setIsSubmitted(true);

    setTimeout(() => {
      props.onHideCart();
    }, 2000);
  };

  const content = !isSubmitted ? (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div
        className={`${classes.control} ${nameHasError ? classes.invalid : ""}`}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          value={nameValue}
        />
        {nameHasError && <p>Name is required.</p>}
      </div>
      <div
        className={`${classes.control} ${
          streetHasError ? classes.invalid : ""
        }`}
      >
        <label htmlFor="street">Street</label>
        <input
          type="text"
          id="street"
          onChange={streetChangeHandler}
          onBlur={streetBlurHandler}
          value={streetValue}
        />
        {streetHasError && <p>Street is required.</p>}
      </div>
      <div
        className={`${classes.control} ${cityHasError ? classes.invalid : ""}`}
      >
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          onChange={cityChangeHandler}
          onBlur={cityBlurHandler}
          value={cityValue}
        />
        {cityHasError && <p>City is required.</p>}
      </div>
      <div
        className={`${classes.control} ${
          postalCodeHasError ? classes.invalid : ""
        }`}
      >
        <label htmlFor="postalCode">Postal Code</label>
        <input
          type="text"
          id="postalCode"
          onChange={postalCodeChangeHandler}
          onBlur={postalCodeBlurHandler}
          value={postalCodeValue}
        />
        {postalCodeHasError && <p>Postal Code is required.</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onHideCheckout}>
          Cancel
        </button>
        <button className={classes.submit} type="submit">
          Submit Order
        </button>
      </div>
    </form>
  ) : (
    <p>Order Submitted!</p>
  );

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return content;
};

export default Checkout;
