const User = require('../models/user-model');

exports.findOne = async function(params) {
  return   User.findOne(params);
};

// exports.findAll = async function(params) {
//   return User.find(params);
// };

// exports.update = async function(user, params, transaction = null) {
//   return   user.save(params, { transaction });
// };

exports.create = async function(params) {
  const user = new User(params);
  return user.save();
};
