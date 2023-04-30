const Expenses = require('../models/expenses-model');

exports.findOne = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.findOne(params).then(data => {
        resolve(data);
      }).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.findAll(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.count = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Expenses.count(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.save = async function(expense, transaction = null) {
  try {
    return new Promise(resolve => {
      expense.save({ transaction }).then(data => {
        resolve(data);
      });
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.create = async function(params, transaction = null) {
  try {
    return new Promise(resolve => {
      Expenses.create(params, { transaction }).then(data => {
        resolve(data);
      });
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.destroy = async function(params, transaction = null) {
  try {
    return new Promise(resolve => {
      Expenses.destroy(params, { transaction }).then(data => {
        resolve(data);
      });
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    return new Promise((resolve, reject) => reject(err));
  }
};
