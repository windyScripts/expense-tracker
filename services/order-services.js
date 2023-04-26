const Order = require('../models/purchases-model');

exports.findOne = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Order.findOne(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.update = function(order, params) {
  try {
    return new Promise((resolve, reject) => {
      order.update(params).then(_ => resolve());
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
