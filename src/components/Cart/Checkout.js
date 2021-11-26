import { useContext, useState } from "react";
import useInput from "../../hooks/use-input";
import CartContext from "../../store/cart-context";

import classes from "./Checkout.module.css";

const Checkout = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInput = (text) => text.trim() !== "";

  const cartCtx = useContext(CartContext);

  const uploadOrder = async (name, address) => {
    const uploadData = { name, address, items: cartCtx.items };

    const res = await fetch(
      "https://react-http-d82d4-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      }
    );

    const data = await res.json();

    console.log(data);
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
    enteredValue: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    valueBlurHandler: addressBlurHandler,
    reset: addressReset,
  } = useInput(validateInput);

  let formIsValid = false;

  if (nameIsValid && addressIsValid) {
    formIsValid = true;
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (!formIsValid) {
      nameBlurHandler();
      addressBlurHandler();
      return;
    }

    uploadOrder(nameValue, addressValue);

    nameReset();
    addressReset();
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
          addressHasError ? classes.invalid : ""
        }`}
      >
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          onChange={addressChangeHandler}
          onBlur={addressBlurHandler}
          value={addressValue}
        />
        {addressHasError && <p>Address is required.</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onHideCart}>
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

  return content;
};

export default Checkout;
