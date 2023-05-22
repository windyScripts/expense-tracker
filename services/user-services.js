const User = require('../models/user-model');

exports.findOne = async function(params) {
  return   User.findOne(params);
};

exports.findAll = async function(params) {
  return   User.findAll(params);
};

exports.update = async function(user, params, transaction = null) {
  return   user.update(params, { transaction });
};

exports.create = async function(params) {
  return   User.create(params);
};
