import cache from "memory-cache";
import voucherCodes from "voucher-code-generator";
import { Client } from "pg";

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
  const queryStr = `INSERT INTO tokens (token, server) VALUES ('${token}', '${server}')`;
  const result = await client.query(queryStr);
  if (result.rowCount == 1) return { token };
};

export const clearSingleUseTokens = async (client: Client, server: string) => {
  const queryStr = `DELETE FROM tokens WHERE server = '${server}'`;
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

export const getServerFromToken = async (client: Client, token: string) => {
  const storedServer = tokenCache.get(token);
  if (!storedServer) {
    const queryStr = `SELECT server FROM tokens WHERE token = '${token}'`;
    const result = await client.query(queryStr);
    if (!result.rowCount) return null;
    const server = result.rows[0].server;
    await clearSingleUseTokens(client, server);
    return server;
  }
  return storedServer as string | null;
};

export default { generateToken, getServerFromToken, generateSingleUseToken };
