const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Files = sequelize.define('download', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = Files;
