import { Client } from "@notionhq/client";
import { getAccessToken } from "./user-service.js";

const findNotionClient = async (userId) => {
  const accessToken = await getAccessToken(userId);

  if (!accessToken) throw new Error("Notion 인증 없음");

  return new Client({ auth: accessToken });
};

export const listUserNotionPages = async (userId) => {
  const notion = await findNotionClient(userId);

  const response = await notion.search({
    filter: { property: "object", value: "page" },
  });

  return { results: response.results };
};

export const readUserNotionPage = async (userId, pageId) => {
  console.log("[notionService] Reading page", pageId);
  const notion = await findNotionClient(userId);

  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    console.log(
      "[notionService] Fetched blocks:",
      Array.isArray(response.results) ? response.results.length : 0
    );
    return { blocks: response.results };
  } catch (err) {
    console.error("[notionService] Error fetching blocks:", err.message);
    throw err;
  }
};
