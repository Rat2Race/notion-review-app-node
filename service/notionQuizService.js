import { getAccessToken } from "./userService.js";
import { agent } from "../agent/index.js";
import { run } from "@openai/agents";

export const generateQuiz = async (user_id, pageId) => {
  const access_token = await getAccessToken(user_id);
  if (!access_token) throw new Error("Notion 인증 없음");

  const result = await run(agent, "Notion 페이지에서 퀴즈 생성", {
    pageId,
    access_token,
  });
  return result.quiz;
};
