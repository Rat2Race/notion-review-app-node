/**
 * <추가예정>
 * 사용자별 AT/RT 저장
 * DB CRUD 구현
 */

import { User } from "../db/user.js";

export const saveAccessToken = async (user_id, access_token) => {
  await User.upsert({ user_id, access_token });
};

export const getAccessToken = async (user_id) => {
  const user = await User.findOne({ where: { user_id: user_id } });
  return user?.access_token;
};
