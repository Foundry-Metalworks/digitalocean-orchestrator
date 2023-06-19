import { Client } from "pg";
import { InviteType } from "../types";

export const addInvite = async (
  client: Client,
  userEmail: string,
  serverId: string
): Promise<boolean> => {
  const queryStr = `INSERT INTO invites (userEmail, serverId) VALUES ('${userEmail}', '${serverId}')`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const getInvite = async (
  client: Client,
  inviteId: string
): Promise<InviteType | undefined> => {
  const queryStr = `SELECT (id, userEmail, serverId) FROM invites WHERE id = '${inviteId}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1 ? result.rows[0] : undefined;
};

export const getForUser = async (
  client: Client,
  userEmail: string
): Promise<InviteType[]> => {
  const queryStr = `SELECT (id, userEmail, serverId) FROM invites WHERE userEmail = '${userEmail}'`;
  const result = await client.query<InviteType>(queryStr);
  return result.rows;
};

export const getForServer = async (
  client: Client,
  serverId: string
): Promise<InviteType[]> => {
  const queryStr = `SELECT (id, userEmail, serverId) FROM invites WHERE serverId = '${serverId}'`;
  const result = await client.query<InviteType>(queryStr);
  return result.rows;
};

export const removeInvite = async (
  client: Client,
  inviteId: number
): Promise<boolean> => {
  const queryStr = `DELETE FROM invites WHERE id = '${inviteId}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export default {
  addInvite,
  getInvite,
  removeInvite,
  getForUser,
  getForServer,
};
