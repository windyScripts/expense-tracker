const PasswordRequests = require('../models/password-requests-model');

exports.findOne = async function(params) {
  return   PasswordRequests.findOne(params);
};

exports.create = async function(params) {
  return   PasswordRequests.create(params);
};

exports.update = async function(password, params) {
  return   password.update(params);
};
