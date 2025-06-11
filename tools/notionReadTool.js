import { tool } from "@openai/agents";
import { z } from "zod";
import { Client } from "@notionhq/client";

export const notionReadTool = tool({
  name: "notion_read",
  description: "사용자별 Access Token으로 Notion 페이지 내용을 읽어온다.",
  parameters: z.object({
    pageId: z.string().describe("Notion 페이지의 ID"),
    access_token: z.string().describe("OAuth로 발급받은 사용자 Access Token"),
  }),
  execute: async ({ pageId, access_token }) => {
    try {
      const notion = new Client({ auth: access_token });
      const response = await notion.pages.retrieve({ page_id: pageId });
      return {
        object: response.object,
        id: response.id,
        properties: response.properties,
      };
    } catch (error) {
      return { error: error.message || "Notion API 호출 오류" };
    }
  },
});
