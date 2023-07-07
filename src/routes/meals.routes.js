const authMiddleware = require('../middlewares/auth.middleware');
const mealsController = require('../controllers/meals.controllers');
const mealsMiddleware = require('../middlewares/meals.middleware');
const restaurantsMiddleware = require('../middlewares/restaurants.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');

const { Router } = require('express');
const router = Router();

router.get('/', mealsController.findMeals);

router.post(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  validationsMiddleware.MealValidation,
  restaurantsMiddleware.validRestaurant,
  mealsController.createNewMeal
);

router
  .use('/:id', mealsMiddleware.validMeal)
  .route('/:id')
  .get(mealsController.findMealById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationsMiddleware.MealValidation,
    mealsController.updateMeal
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    mealsController.deleteMeal
  );

module.exports = router;
