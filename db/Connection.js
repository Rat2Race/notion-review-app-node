// const mysql = require("mysql2");

// let conn;

// const connectDatabase = async () => {
//   if (!conn) {
//     try {
//       conn = await mysql.createConnection({
//         host: "localhost",
//         user: "rat",
//         password: "thisisTestpw!#%&",
//         database: "notion_oauth_db",
//       });
//       console.log("MySQL 연결 성공");
//     } catch (err) {
//       console.error("MySQL 연결 실패: ", err.stack);
//       throw err;
//     }
//   }
//   return conn;
// };

// const closeDatabase = async () => {
//   if (conn) {
//     try {
//       await conn.end();
//       console.log("MySQL 연결이 성공적으로 종료되었습니다.");
//       conn = null;
//     } catch (err) {
//       console.error("연결 종료 중 오류가 발생하였습니다: ", err.stack);
//     }
//   }
// };

// module.exports = {
//     connectDatabase,
//     closeDatabase,
// }

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
