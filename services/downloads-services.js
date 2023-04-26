const Downloads = require('../models/downloads-model');

exports.create = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.create(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findOne = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.findOne(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = async function(params) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.findAll(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
