const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Orders = require('../models/orders.model');
const Reviews = require('../models/reviews.model');
const Users = require('../models/users.model');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access❕', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is not longer active❕', 401)
    );
  }

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.❕', 401));
  }

  next();
});

exports.protectAccountOwnerByReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const review = await Reviews.findOne({
    where: { id },
  });

  if (review.userId !== sessionUser.id) {
    return next(new AppError('You do not own this account.❕', 401));
  }

  next();
});

exports.protectAccountOwnerByOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    where: { id },
  });

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You do not own this account.❕', 401));
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action❕', 403)
      );
    }

    next();
  };
};