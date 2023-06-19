import { Client } from "pg";
import { PermissionsType, ServerUserType } from "../types";

export const addUser = async (
  client: Client,
  id: string,
  server: string,
  roleId?: number
): Promise<boolean> => {
  const queryStr = `
  INSERT into users (userId, serverId, roleId)
  VALUES ('${id}', '${server}', '${roleId || 1}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const isUserInServer = async (
  client: Client,
  userId: string,
  serverId: string
): Promise<boolean> => {
  const queryStr = `SELECT EXISTS(SELECT 1 FROM USERS WHERE userId = '${userId}' AND serverId = '${serverId}')`;
  const result = await client.query<{ exists: boolean }>(queryStr);
  return result.rows[0].exists;
};

export const getForServer = async (
  client: Client,
  server: string
): Promise<ServerUserType[]> => {
  const queryStr = `SELECT userId AS id, roleId AS role FROM users WHERE serverId = '${server}'`;
  const result = await client.query<ServerUserType>(queryStr);
  return result.rows;
};

export const getUserServerPermissions = async (
  client: Client,
  userId: string,
  serverId: string
): Promise<PermissionsType> => {
  const queryStr = `SELECT roles.canStart, roles.canStop, roles.canSave, roles.canInvite 
                    FROM users JOIN roles ON users.roleId = roles.roleId 
                    WHERE users.userId = '${userId}' AND users.serverId = '${serverId}'`;
  const result = await client.query<PermissionsType>(queryStr);
  return result.rowCount
    ? result.rows[0]
    : { canstart: false, canstop: false, cansave: false, caninvite: false };
};

export default {
  addUser,
  isUserInServer,
  getForServer,
  getUserServerPermissions,
};
