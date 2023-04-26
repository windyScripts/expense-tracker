const User = require('../models/user-model');

exports.findOne = function(params) {
  try {
    return new Promise((resolve, reject) => {
      User.findOne(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = function(params) {
  try {
    return new Promise((resolve, reject) => {
      User.findAll(params).then(users => resolve(users)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

// add user as an argument.

exports.update = function(user, params) {
  try {
    return new Promise((resolve, reject) => {
      user.update(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.create = function(name, email, password) {
  try {
    return new Promise((resolve, reject) => {
      User.create({
        name,
        email,
        password,
      }).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
