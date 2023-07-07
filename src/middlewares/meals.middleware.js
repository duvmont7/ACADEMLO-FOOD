const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

exports.validMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meals.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'restaurantId', 'status'],
    },
    include: [
      {
        model: Restaurants,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!meal) {
    return next(new AppError(`The meal with id:${id} was not found ❗️`, 404));
  }

  req.meal = meal;
  next();
});