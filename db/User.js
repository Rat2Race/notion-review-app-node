import { DataTypes } from "sequelize";
import { sequelize } from "./connection.js";

export const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();
