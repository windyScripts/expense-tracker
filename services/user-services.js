const User = require('../models/user-model');

exports.findOne = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      User.findOne(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      User.findAll(params).then(users => resolve(users)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.update = async function(user, params, transaction = null) {
  try {
    return new Promise(resolve => {
      user.update(params, { transaction }).then(data => {
        resolve(data);
      });
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.create = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      User.create(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
