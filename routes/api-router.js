import express from "express";
import axios from "axios";
import { generateQuiz } from "../service/notion-quiz-service.js";
import {
  readUserNotionPage,
  listUserNotionPages,
} from "../service/notion-service.js";
import NotionBlockParser from "../service/notion-block-parser.js";

const router = express.Router();

router.post("/oauth/callback", async (req, res) => {
  const { code, redirectUri } = req.body;
  try {
    const tokenRes = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      { grant_type: "authorization_code", code, redirectUri },
      {
        auth: {
          username: process.env.NOTION_CLIENT_ID,
          password: process.env.NOTION_CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/json" },
      }
    );

    const { accessToken, owner } = tokenRes.data;
    const userId = owner.user.id;

    await saveAccessToken(userId, accessToken);

    res.json({ success: true, userId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/search", async (req, res) => {
  const { userId, pageId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId 필수 파라미터가 없습니다." });
  }

  try {
    const response = pageId
      ? await readUserNotionPage(userId, pageId)
      : await listUserNotionPages(userId);
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/quiz", async (req, res) => {
  const { userId, pageId } = req.body;
  const { blocks } = await readUserNotionPage(userId, pageId);
  const text = NotionBlockParser.blocksToPlainText(blocks);

  console.log("[quiz-service]: ", text);
  try {
    const quiz = await generateQuiz(text);
    res.json({ quiz });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
