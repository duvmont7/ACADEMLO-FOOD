const Meals = require('./meals.model');
const Orders = require('./orders.model');
const Restaurants = require('./restaurants.model');
const Reviews = require('./reviews.model');
const Users = require('./users.model');

const initModel = () => {
  Users.hasMany(Orders);
  Orders.belongsTo(Users);

  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  Meals.hasOne(Orders);
  Orders.belongsTo(Meals);

  Restaurants.hasMany(Meals);
  Meals.belongsTo(Restaurants);

  Restaurants.hasMany(Reviews);
  Reviews.belongsTo(Restaurants);
};

module.exports = initModel;