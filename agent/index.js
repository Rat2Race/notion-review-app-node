import { Agent } from "@openai/agents";
import { z } from "zod";
import { notionReadTool } from "../tools/notionReadTool.js";
import { notionBlockParserTool } from "../tools/notionBlockParserTool.js";
import { quizGeneratorTool } from "../tools/quizGeneratorTool.js";

export const agent = new Agent({
  name: "quiz-generator",
  description: "퀴즈 생성기",
  instructions:
    "Use the provided tools to read a Notion page, convert it to text and generate a quiz.",
  outputType: z.object({ quiz: z.string() }),
  model: "gpt-4o",
  tools: [notionReadTool, notionBlockParserTool, quizGeneratorTool],
});
