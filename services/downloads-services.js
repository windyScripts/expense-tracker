const Downloads = require('../models/downloads-model');

exports.create = function(url) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.create({
        url,
      }).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findOne = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.findOne(params).then(user => resolve(user)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};

exports.findAll = function(params) {
  try {
    return new Promise((resolve, reject) => {
      Downloads.findAll(params).then(data => resolve(data)).catch(err => reject(err));
    });
  } catch (err) {
    return new Promise((resolve, reject) => reject(err));
  }
};
