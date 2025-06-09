const express = require("express");
const cors = require("cors");

const notionRoutes = require("./routes/Notion");
const { sequelize } = require("./db/Connection");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", notionRoutes);

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`${PORT}번 포트에서 서버 실행 중`));
});
