import { Client } from "pg";
import { UserServerType } from "../types";
import cache from "memory-cache";
import voucherCodes from "voucher-code-generator";

export const addServer = async (
  client: Client,
  name: string,
  ownerId: string
) => {
  const addServerStr = `
  INSERT INTO servers (serverid, ownerid)
  VALUES('${name}', '${ownerId}')
  `;
  const result = await client.query(addServerStr);
  return result.rowCount == 1;
};

export const hasServer = async (
  client: Client,
  name: string
): Promise<boolean> => {
  const queryStr = `SELECT EXISTS(SELECT 1 FROM servers WHERE serverId = '${name}')`;
  const result = await client.query(queryStr);
  return result.rows[0].exists;
};

export const getForUser = async (
  client: Client,
  userId: string
): Promise<UserServerType[]> => {
  const queryStr = `SELECT serverId AS name, roleId AS role FROM users WHERE userId = '${userId}'`;
  const result = await client.query(queryStr);
  return result.rows || [];
};

export const getOwnerId = async (
  client: Client,
  serverId: string
): Promise<string | null> => {
  const queryStr = `SELECT ownerId FROM servers WHERE serverId = '${serverId}'`;
  const result = await client.query(queryStr);
  return result.rowCount ? result.rows[0].ownerid : null;
};

const tokenCache = new cache.Cache();
const serverCache = new cache.Cache();
const TOKEN_EXPIRE_TIME = 60000;
const TOKEN_LENGTH = 8;

export const generateSingleUseToken = async (
  client: Client,
  server: string
) => {
  await clearSingleUseTokens(client, server);
  const [token] = voucherCodes.generate({
    length: TOKEN_LENGTH,
    charset: voucherCodes.charset("alphanumeric"),
    count: 1,
  });
  const queryStr = `UPDATE servers SET token = '${token}' WHERE serverId = '${server}'`;
  const result = await client.query(queryStr);
  if (result.rowCount == 1) return { token };
};

export const clearSingleUseTokens = async (client: Client, server: string) => {
  const queryStr = `UPDATE servers SET token = null WHERE serverId = '${server}'`;
  const result = await client.query(queryStr);
  return result.rowCount > 0;
};

export const generateToken = (server: string) => {
  if (serverCache.get(server)) {
    return { token: serverCache.get(server) };
  }
  const [token] = voucherCodes.generate({
    length: TOKEN_LENGTH,
    charset: voucherCodes.charset("alphanumeric"),
    count: 1,
  });
  tokenCache.put(token, server, TOKEN_EXPIRE_TIME);
  serverCache.put(server, token, TOKEN_EXPIRE_TIME);
  return { token };
};

export const getFromToken = async (client: Client, token: string) => {
  const storedServer = tokenCache.get(token);
  if (!storedServer) {
    const queryStr = `SELECT serverId FROM servers WHERE token = '${token}'`;
    const result = await client.query(queryStr);
    if (!result.rowCount) return null;
    const server = result.rows[0].serverid;
    await clearSingleUseTokens(client, server);
    return server;
  }
  return storedServer as string | null;
};

export default {
  addServer,
  hasServer,
  getForUser,
  generateToken,
  generateSingleUseToken,
  getFromToken,
};
