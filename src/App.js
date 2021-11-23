import { useState } from "react";

import CartProvider from "./store/CartProvider";
import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import Cart from "./components/Cart/Cart";

function App() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  const showCartHandler = () => {
    setIsCartVisible(true);
  };

  const hideCartHandler = () => {
    setIsCartVisible(false);
  };

  return (
    <CartProvider>
      {isCartVisible && <Cart onHideCart={hideCartHandler} />}
      <Header onShowCart={showCartHandler}></Header>
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
