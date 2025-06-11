require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../model/User");

const databaseName = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const dialect = process.env.DATABASE_DIALECT;

const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  dialect: dialect,
});

const User = UserModel(sequelize, DataTypes);

module.exports = { sequelize, User };
