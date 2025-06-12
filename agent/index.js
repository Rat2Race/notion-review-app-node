import { Agent } from "@openai/agents";
import { notionReadTool } from "../tools/notionReadTool.js";
import { notionBlockParserTool } from "../tools/notionBlockParserTool.js";
import { quizGeneratorTool } from "../tools/quizGeneratorTool.js";

export const agent = new Agent({
  name: "quiz-generator",
  description: "퀴즈 생성기",
  model: "gpt-4o",
  tools: [notionReadTool, notionBlockParserTool, quizGeneratorTool],
});
