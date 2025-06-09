module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    user_id: { type: DataTypes.STRING, allowNull: false },
    access_token: { type: DataTypes.STRING, allowNull: false },
  });
