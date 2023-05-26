const Downloads = require('../models/downloads-model');

exports.create = function(params) {
  return  Downloads.create(params);
};

exports.findOne = function(params) {
  return   Downloads.findOne(params);
};

exports.findAll = function(params) {
  return   Downloads.findAll(params);
};
