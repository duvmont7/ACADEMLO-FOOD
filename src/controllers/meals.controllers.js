const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

exports.findMeals = catchAsync(async (req, res, next) => {
  const meals = await Meals.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'status', 'restaurantId'],
    },
    include: [
      {
        model: Restaurants,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
      },
    ],
  });
  res.status(201).json({
    status: 'success',
    results: meals.length,
    meals,
  });
});

exports.findMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(201).json({
    status: 'success',
    meal,
  });
});

exports.createNewMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;
  const { restaurant } = req;

  const mealInDB = await Meals.findOne({
    where: {
      name,
    },
  });

  if (mealInDB) {
    return next(new AppError('There is already a meal with this name❎', 409));
  }

  const meal = await Meals.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'The meal was created.✅',
    meal: {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      restaurant: restaurant.name,
    },
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  const updatedMeal = await meal.update({ name, price });

  res.status(201).json({
    status: 'success',
    message: 'The meal was updated.✅',
    updatedMeal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'disabled' });

  res.status(201).json({
    status: 'success',
    message: 'The meal was deleted.✅',
  });
});