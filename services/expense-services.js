const Expenses = require('../models/expenses-model');

exports.findOne = async function(params) {
  return   Expenses.findOne(params);
};

exports.findMany = async function(findParams,sortParams,limit) {
  return   Expenses.find(findParams).sort(sortParams).limit(limit).exec();
};

exports.count = async function(params) {
    return Expenses.countDocuments(params)
};

exports.save = async function(expense, session = null) {
  return   expense.save({ session });
};

exports.create = async function(params, session = null) {
  const expense = new Expenses(params);
  await expense.save({ session })
};

exports.destroy = async function(params, session = null) {
  return   Expenses.deleteOne(params, { session });
};
