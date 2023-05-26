const User = require('../models/user-model');

exports.findOne = async function(params) {
  return   User.findOne(params);
};

// exports.findAll = async function(params) {
//   return User.find(params);
// };

exports.update = async function(user, params, session = null) {
  User.updateOne({user:user},params,{session})
  //const user = user.save(params, { session });
};

exports.create = async function(params) {
  const user = new User(params);
  return user.save();
};

exports.findById = async function(_id) {
  return User.findById(_id).exec();
};