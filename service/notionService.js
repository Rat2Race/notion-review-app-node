import { getAccessToken } from "./UserService.js";
import { notionReadTool } from "../tools/notionReadTool.js";

export const readUserNotionPage = async ({ userId, pageId }) => {
  const access_token = await getAccessToken(userId);
  if (!access_token)
    throw new Error("AccessToken이 없습니다. 먼저 Notion 인증 필요!");

  return await notionReadTool.execute({ pageId, access_token });
};
