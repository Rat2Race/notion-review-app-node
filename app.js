import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/apiRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("서버 시작");
});
