import { useState, useEffect } from 'react/cjs/react.development';
import useHttp from '../../../hooks/use-http';
import Card from '../../UI/Card/Card';
import MealItem from '../MealItem/MealItem';
import classes from './AvailableMeals.module.css';



const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const {isLoading, error, sendRequest: fetchMeals } = useHttp();
  useEffect(() => {

    const transformMeals = mealsObj => {
      const loadedMeals = [];
      for (const mealsKey in mealsObj) {
        loadedMeals.push(
          {
            id: mealsKey,
            name: mealsObj[mealsKey].name,
            description: mealsObj[mealsKey].description,
            price: mealsObj[mealsKey].price
          }
        );
      }
      console.log(loadedMeals);
      setMeals(loadedMeals)
    }
    fetchMeals(
      {
        url: 'https://react-http-313f1-default-rtdb.firebaseio.com/meals.json'
      },
      transformMeals
    )
  }, [fetchMeals]);
  let content = <p> No meals found </p>;

  if (isLoading) {
    content = <p> Loading... </p>;
  }
  if (error) {
    content = <p> { error }</p>
  }
  if (meals.length > 0) {
    content = (
      <ul>
        { meals.map(meal => {
            return (
              <MealItem
                id={meal.id}
                key={meal.id}
                name={meal.name}
                description={meal.description}
                price={meal.price}
              />
            )
        })
      }
      </ul>
    )
  };
  return(
    <section className={classes.meals}>
      <Card>
        {content}
      </Card>
    </section>
  )
}

export default AvailableMeals;