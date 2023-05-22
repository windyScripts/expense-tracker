const Expenses = require('../models/expenses-model');

exports.findOne = async function(params) {
  return   Expenses.findOne(params);
};

exports.findAll = async function(params) {
  return   Expenses.findAll(params);
};

exports.count = async function(params) {
  return   Expenses.count(params);
};

exports.save = async function(expense, transaction = null) {
  return   expense.save({ transaction });
};

exports.create = async function(params, transaction = null) {
  return   Expenses.create(params, { transaction });
};

exports.destroy = async function(params, transaction = null) {
  return   Expenses.destroy(params, { transaction });
};
