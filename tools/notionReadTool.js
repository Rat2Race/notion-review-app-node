import { tool } from "@openai/agents";
import { z } from "zod";
import { Client } from "@notionhq/client";

export const notionReadTool = tool({
  name: "notion_read",
  description: "Notion 페이지의 블록을 가져옴",
  parameters: z.object({
    pageId: z.string(),
    access_token: z.string(),
  }),
  execute: async ({ pageId, access_token }) => {
    const notion = new Client({ auth: access_token });
    const response = await notion.blocks.children.list({ block_id: pageId });
    return { blocks: response.results };
  },
});
