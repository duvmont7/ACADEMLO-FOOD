const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');

exports.validRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurants.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Reviews,
        where: { status: 'active' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'restaurantId'] },
        required: false,
      },
      {
        model: Meals,
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError(`Restaurant with id:${id} was not found 💢`, 404));
  }

  req.meals = restaurant.meals;
  req.restaurant = restaurant;
  next();
});

exports.validReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const review = await Reviews.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  if (!review) {
    return next(new AppError(`The review was not found 💢`, 404));
  }

  req.review = review;
  next();
});