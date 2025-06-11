require("dotenv").config();
const express = require("express");
const router = express.Router();
const userService = require("../service/UserService");
// const { Client } = require("@notionhq/client");
const NotionBlockParser = require("../service/NotionBlockParser");

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const authHeader =
  "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

router.post("/oauth/token", async (req, res) => {
  const { code, redirect_uri } = req.body;

  try {
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
      }),
    });

    const authorization_response = await response.json();

    await userService.createUser(
      authorization_response.workspace_id,
      authorization_response.access_token
    );

    res.json({
      access_token: authorization_response.access_token,
      user_id: authorization_response.workspace_id, // ← 이 부분 추가!
    });
  } catch (err) {
    console.error(err); // 로그에 출력
    res.status(500).json({ error: err.message });
  }
});

router.post("/search", async (req, res) => {
  const { user_id, query } = req.body;
  const user = await userService.getUserById(user_id);

  if (!user) return res.status(404).json({ error: "유저 낫 빠운드" });

  try {
    const searchRes = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query || "",
        page_size: 10,
      }),
    });
    console.log("searchRes status:", searchRes.status);
    const data = await searchRes.json();
    console.log("search API 응답:", data);
    res.json(data);
  } catch (err) {
    console.error("Notion search error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/quiz", async (req, res) => {
  const { user_id, page_id } = req.body;
  const user = await userService.getUserById(user_id);

  if (!user) return res.status(404).json({ error: "User not found" });

  try {
    const pageRes = await fetch("https://api.notion.com/v1/pages/" + page_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });
    const pageData = await pageRes.json();

    const blocksRes = await fetch(
      `https://api.notion.com/v1/blocks/${page_id}/children`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    const blocksData = await blocksRes.json();
    console.log("Notion blocksData:", blocksData);

    const plainText = NotionBlockParser.blocksToPlainText(blocksData.results);
    console.log("plainText:", plainText); // ★추가

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "아래 노션 노트 내용을 바탕으로 3개의 객관식 퀴즈를 만들어줘. 답변은 마크다운으로, 정답도 표기해줘.",
            },
            { role: "user", content: plainText },
          ],
        }),
      }
    );

    const openaiData = await openaiRes.json();
    console.log("OpenAI 응답:", openaiData);
    res.json({
      quiz: openaiData.choices?.[0]?.message?.content || "AI 응답 없음",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
