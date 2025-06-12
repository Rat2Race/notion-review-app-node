// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import axios from "axios";
// import { tool } from "@openai/agents";
// import { Client } from "@notionhq/client";

// import userService from "../service/userService";
// import NotionBlockParser from "../service/notionBlockParser";

// const router = express.Router();

// const clientId = process.env.OAUTH_CLIENT_ID;
// const clientSecret = process.env.OAUTH_CLIENT_SECRET;
// const authHeader =
//   "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

// router.post("/oauth/token", async (req, res) => {
//   const { code, redirect_uri } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.notion.com/v1/oauth/token",
//       {
//         grant_type: "authorization_code",
//         code,
//         redirect_uri,
//       },
//       {
//         auth: { username: clientId, password: clientSecret },
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     const { access_token, owner } = response.data;
//     const user_id = owner.user.id;

//     await User.upsert({ user_id, access_token });
//     res.json({ ok: true });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

//   try {
//     const response = await fetch("https://api.notion.com/v1/oauth/token", {
//       method: "POST",
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         grant_type: "authorization_code",
//         code: code,
//         redirect_uri: redirect_uri,
//       }),
//     });

//     const authorization_response = await response.json();

//     await userService.createUser(
//       authorization_response.workspace_id,
//       authorization_response.access_token
//     );

//     res.json({
//       access_token: authorization_response.access_token,
//       user_id: authorization_response.workspace_id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/search", async (req, res) => {
//   const { user_id, query } = req.body;
//   const user = await userService.getUserById(user_id);

//   if (!user) return res.status(404).json({ error: "유저 낫 빠운드" });

//   try {
//     const searchRes = await fetch("https://api.notion.com/v1/search", {
//       method: "POST",
//       headers: {
//         Authorization: "Bearer " + user.access_token,
//         "Notion-Version": "2022-06-28",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: query || "",
//         page_size: 10,
//       }),
//     });
//     console.log("searchRes status:", searchRes.status);
//     const data = await searchRes.json();
//     console.log("search API 응답:", data);
//     res.json(data);
//   } catch (err) {
//     console.error("Notion search error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/quiz", async (req, res) => {
//   const { user_id, page_id } = req.body;
//   const user = await userService.getUserById(user_id);

//   if (!user) return res.status(404).json({ error: "User not found" });

//   try {
//     const pageRes = await fetch("https://api.notion.com/v1/pages/" + page_id, {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + user.access_token,
//         "Notion-Version": "2022-06-28",
//         "Content-Type": "application/json",
//       },
//     });
//     const pageData = await pageRes.json();

//     const blocksRes = await fetch(
//       `https://api.notion.com/v1/blocks/${page_id}/children`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + user.access_token,
//           "Notion-Version": "2022-06-28",
//         },
//       }
//     );
//     const blocksData = await blocksRes.json();
//     console.log("Notion blocksData:", blocksData);

//     const plainText = NotionBlockParser.blocksToPlainText(blocksData.results);
//     console.log("plainText:", plainText);

//     const openaiRes = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer " + process.env.OPENAI_API_KEY,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "아래 노션 노트 내용을 바탕으로 3개의 객관식 퀴즈를 만들어줘. 답변은 마크다운으로, 정답도 표기해줘.",
//             },
//             { role: "user", content: plainText },
//           ],
//         }),
//       }
//     );

//     const openaiData = await openaiRes.json();
//     console.log("OpenAI 응답:", openaiData);
//     res.json({
//       quiz: openaiData.choices?.[0]?.message?.content || "AI 응답 없음",
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

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
