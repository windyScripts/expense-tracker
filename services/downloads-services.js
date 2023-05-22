const Downloads = require('../models/downloads-model');

exports.create = async function(params) {
    return  Downloads.create(params)
};

exports.findOne = async function(params) {
  
  return   Downloads.findOne(params)
    
};

exports.findAll = async function(params) {
  
  return   Downloads.findAll(params)
    
};
