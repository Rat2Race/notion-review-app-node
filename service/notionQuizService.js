import { getAccessToken } from "./UserService.js";
import { agent } from "../agent/index.js";
import { run } from "@openai/agents";

export const generateQuiz = async (user_id, pageId) => {
  console.log("[notionQuizService] Generating quiz for page", pageId);
  const access_token = await getAccessToken(user_id);

  if (!access_token) throw new Error("Notion 인증 없음");

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "아래 내용을 바탕으로 객관식 문제 3개를 만들어줘. 정답도 표기해줘.",
          },
          { role: "user", content: text },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const quiz = res.data.choices[0]?.message.content;
    console.log("[quizGeneratorTool] Quiz generated:\n" + quiz);
    return { quiz };
  } catch (err) {
    console.error(
      "[quizGeneratorTool] Quiz generation failed:",
      err.response?.data || err.message
    );
    throw err;
  }
};
