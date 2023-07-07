const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');
const Restaurants = require('../models/restaurants.model');

exports.validOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderCompleted = await Orders.findOne({
    where: {
      id,
      status: 'completed',
    },
  });

  if (orderCompleted) {
    return next(
      new AppError(`The order with id:${id} has already been completed.✅`)
    );
  }

  const order = await Orders.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'status'],
    },
    include: [
      {
        model: Meals,
        include: [
          {
            model: Restaurants,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'status'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!order) {
    return next(new AppError(`The order with id:${id} was not found 💢`, 404));
  }

  req.order = order;
  next();
});
