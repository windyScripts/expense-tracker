const Expenses = require('../models/expenses-model');

exports.findOne = async function(params) {
  return   Expenses.findOne(params);
};

exports.findMany = async function(findParams,sortParams,limit) {
  return   Expenses.find(findParams).sort(sortParams).limit(limit);
};

exports.count = async function(params) {
  return   Expenses.countDocuments(params);
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
