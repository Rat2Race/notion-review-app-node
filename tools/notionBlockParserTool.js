import { tool } from "@openai/agents";
import { z } from "zod";
import NotionBlockParser from "../service/notionBlockParser.js";

export const notionBlockParserTool = tool({
  name: "notion_block_parse",
  description: "노션 블록 배열을 plain 텍스트로 변환",
  parameters: z.object({
    blocks: z.array(z.object({ type: z.string() }).strict()),
  }),
  execute: async ({ blocks }) => {
    const text = NotionBlockParser.blocksToPlainText(blocks);
    return { text };
  },
});
