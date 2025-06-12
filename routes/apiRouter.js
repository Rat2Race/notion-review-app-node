import express from "express";
import axios from "axios";
import { Client } from "@notionhq/client";
import { getAccessToken, saveAccessToken } from "../service/UserService.js";
import { generateQuiz } from "../service/notionQuizService.js";

const router = express.Router();

router.post("/oauth/callback", async (req, res) => {
  const { code, redirect_uri } = req.body;
  try {
    const tokenRes = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      { grant_type: "authorization_code", code, redirect_uri },
      {
        auth: {
          username: process.env.NOTION_CLIENT_ID,
          password: process.env.NOTION_CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token, owner } = tokenRes.data;
    const user_id = owner.user.id;

    await saveAccessToken(user_id, access_token);

    res.json({ success: true, user_id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/search", async (req, res) => {
  const { user_id, query = "" } = req.body;
  const access_token = await getAccessToken(user_id);
  if (!access_token) return res.status(401).json({ error: "Notion 인증 필요" });

  try {
    const notion = new Client({ auth: access_token });
    const response = await notion.search({
      query,
      page_size: 10,
      filter: { property: "object", value: "page" },
    });
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/quiz", async (req, res) => {
  const { user_id, pageId } = req.body;
  try {
    const quiz = await generateQuiz(user_id, pageId);
    res.json({ quiz });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
