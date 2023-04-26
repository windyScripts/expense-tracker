const jwt = require('jsonwebtoken');

const User = require('../models/user-model');

exports.authorization = async(req, res, next) => {
  if (req.header('Authorization') === undefined) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  try {
    const token = req.header('Authorization');
    console.log(token, '12345');
    const id = Number(jwt.verify(token, '12345').userId);
    const user = await User.findByPk(id);
    if (user === null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};
