const Order = require('../models/purchases-model');

exports.findOne = function(params) {
  return   Order.findOne(params);
};

exports.update = function(order, params) {
  return   order.update(params);
};
