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

const { Sequelize } = require("sequelize");
const UserModel = require("../model/user");

const sequelize = new Sequelize("notion_oauth_db", "rat", "thisisTestpw!#%&", {
  host: "localhost",
  dialect: "mysql",
});

const User = UserModel(sequelize);

module.exports = { sequelize, User };
