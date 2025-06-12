import { getAccessToken } from "./UserService.js";
import { agent } from "../agent/index.js";
import { run } from "@openai/agents";

export const generateQuiz = async (user_id, pageId) => {
  console.log("[notionQuizService] Generating quiz for page", pageId);
  const access_token = await getAccessToken(user_id);
  if (!access_token) throw new Error("Notion 인증 없음");

  const result = await run(agent, "Notion 페이지에서 퀴즈 생성", {
    pageId,
    access_token,
  });
  console.log("[notionQuizService] Agent final output:", result.finalOutput);
  return result.finalOutput?.quiz ?? result.finalOutput;
};
