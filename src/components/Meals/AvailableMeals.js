import { useCallback, useState, useEffect } from "react";
import Card from "../UI/Card";

import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const DUMMY_MEALS = [
  {
    id: "m1",
    name: "Sushi",
    description: "Finest fish and veggies",
    price: 22.99,
  },
  {
    id: "m2",
    name: "Schnitzel",
    description: "A german specialty!",
    price: 16.5,
  },
  {
    id: "m3",
    name: "Barbecue Burger",
    description: "American, raw, meaty",
    price: 12.99,
  },
  {
    id: "m4",
    name: "Green Bowl",
    description: "Healthy...and green...",
    price: 18.99,
  },
];
// NOTE: Above is fake data, normally would retrieve actual data from a server
console.log(DUMMY_MEALS);

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);

  const retrieveMeals = useCallback(async () => {
    const res = await fetch(
      "https://react-http-d82d4-default-rtdb.firebaseio.com/meals.json"
    );
    const data = await res.json();

    const mealsData = [];

    for (const key in data) {
      mealsData.push({
        id: key,
        name: data[key].name,
        description: data[key].description,
        price: data[key].price,
      });
    }

    setMeals(mealsData);
  }, []);

  useEffect(() => {
    retrieveMeals();
  }, [retrieveMeals]);

  const mealsList = meals.map((meal) => {
    return (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    );
  });

  return (
    <Card className={classes.meals}>
      <ul>{mealsList}</ul>
    </Card>
  );
};

export default AvailableMeals;
