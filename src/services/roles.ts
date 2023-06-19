import { Client } from "pg";
import { ROLES } from "../types";

export const getUserRole = async (
  client: Client,
  userId: string,
  serverId: string
): Promise<ROLES> => {
  const queryStr = `SELECT roleId FROM users WHERE (userId = '${userId}' AND serverId = '${serverId}')`;
  const result = await client.query(queryStr);
  return result.rowCount ? Number(result.rows[0].roleid) : 0;
};

export default {
  getUserRole,
};
