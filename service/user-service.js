/**
 * <추가예정>
 * 사용자별 AT/RT 저장
 * DB CRUD 구현
 */

import { User } from "../db/user.js";

export const saveAccessToken = async (userId, accessToken) => {
  await User.upsert({ userId, accessToken });
};

export const getAccessToken = async (userId) => {
  const user = await User.findOne({ where: { userId } });
  return user.accessToken;
};
