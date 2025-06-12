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
    console.log("[notionReadTool] Reading page", pageId);
    const notion = new Client({ auth: access_token });

    try {
      const response = await notion.blocks.children.list({ block_id: pageId });
      console.log(
        "[notionReadTool] Fetched blocks:",
        Array.isArray(response.results) ? response.results.length : 0
      );
      return { blocks: response.results };
    } catch (err) {
      console.error("[notionReadTool] Error fetching blocks:", err.message);
      throw err;
    }
  },
});
