const PasswordRequests = require('../models/password-requests-model');

exports.findOne = function(params) {
  try {
    return new Promise((resolve, reject) => {
      PasswordRequests.findOne(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.create = function(userId, isActive, id) {
  try {
    return new Promise((resolve, reject) => {
      PasswordRequests.create(userId, isActive, id).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.update = function(password, params) {
  try {
    return new Promise((resolve, reject) => {
      password.update(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
