import { getAccessToken } from "./UserService.js";
import { notionReadTool } from "../tools/notionReadTool.js";

export const readUserNotionPage = async ({ userId, pageId }) => {
  const access_token = await getAccessToken(userId);
  if (!access_token)
    throw new Error("AccessToken이 없습니다. 먼저 Notion 인증 필요!");

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
};
