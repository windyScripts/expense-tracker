const Order = require('../models/purchases-model');

exports.findOne = async function(params) {
  
  return   Order.findOne(params)
};

exports.update = async function(order, params) {
  
  return   order.update(params)
};
