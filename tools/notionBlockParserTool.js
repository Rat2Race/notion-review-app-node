import { tool } from "@openai/agents";
import { z } from "zod";
import NotionBlockParser from "../service/NotionBlockParser.js";

export const notionBlockParserTool = tool({
  name: "notion_block_parse",
  description: "노션 블록 배열을 plain 텍스트로 변환",
  parameters: z.object({
    blocks: z.array(z.object({ type: z.string() }).strict()),
  }),
  execute: async ({ blocks }) => {
    console.log(
      "[notionBlockParserTool] Parsing",
      Array.isArray(blocks) ? blocks.length : 0,
      "blocks"
    );

    try {
      const text = NotionBlockParser.blocksToPlainText(blocks);
      console.log("[notionBlockParserTool] Parsed text:\n" + text);
      return { text };
    } catch (err) {
      console.error("[notionBlockParserTool] Parsing failed:", err.message);
      throw err;
    }

    const text = NotionBlockParser.blocksToPlainText(blocks);
    console.log("[notionBlockParserTool] Parsed text:\n" + text);
    return { text };

  },
});
