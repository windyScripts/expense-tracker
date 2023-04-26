const Expenses = require('../models/expenses-model');

exports.findOne = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.findOne(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.findAll(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.count = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.count(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.save = function(expense) {
  try {
    return new Promise((resolve, reject) => {
      expense.save().then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
