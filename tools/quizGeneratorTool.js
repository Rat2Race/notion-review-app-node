import { tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";

export const quizGeneratorTool = tool({
  name: "quiz_generator",
  description: "텍스트를 받아서 퀴즈 생성",
  parameters: z.object({ text: z.string() }),
  execute: async ({ text }) => {
    console.log("[quizGeneratorTool] Generating quiz with text:\n" + text);
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
  },
});
