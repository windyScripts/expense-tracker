const PasswordRequests = require('../models/password-requests-model');

exports.findOne = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      PasswordRequests.findOne(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.create = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      PasswordRequests.create(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.update = async function(password, params) {
  try {
    return new Promise((resolve, reject) => {
      password.update(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
