import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const generateQuiz = async (text) => {
  try {
    const res = await axios.post(
      process.env.OPENAI_API_URL,
      {
        model: process.env.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              process.env.OPENAI_ROLE + " " + process.env.OPENAI_INSTRUCTION,
          },
          {
            role: "user",
            content: text,
          },
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
    console.log("[notionQuizService] Quiz generated:\n" + quiz);

    return quiz;
  } catch (err) {
    console.error(
      "[notionQuizService] Quiz generation failed:",
      err.response?.data || err.message
    );

    throw err;
  }
};
