const User = require('../models/user-model');

exports.findOne = function(params) {
  return   User.findOne(params);
};

// exports.findAll = async function(params) {
//   return User.find(params);
// };

// exports.update = function(user, params, session = null) {
//   return User.updateOne({'userId':user._id},params,{session})
//   //user.update(params, { session });
//   /* user = {...user,...params}
//   console.log(user);
//   return user.save(); */
// };

exports.create = function(params) {
  const user = new User(params);
  return user.save();
};

exports.findById = function(_id) {
  return User.findById(_id).exec();
};

exports.save= function(user, session = null){
  return user.save({session});
}