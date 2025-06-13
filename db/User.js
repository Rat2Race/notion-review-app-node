import { DataTypes } from "sequelize";
import { sequelize } from "./Connection.js";

export const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING,
    field: "user_id",
    primaryKey: true,
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING,
    field: "access_token",
    allowNull: false,
  },
});

sequelize.sync();
