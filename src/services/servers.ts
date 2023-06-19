import { decrypt, encrypt } from "../util/encrypt";
import { Client } from "pg";
import { UserServerType } from "../types";

export const addServer = async (
  client: Client,
  name: string,
  doToken: string
) => {
  const encryptedDoToken = encrypt(doToken);
  const addServerStr = `
  INSERT INTO servers (serverid, dotoken, doiv)
  VALUES('${name}', '${encryptedDoToken.value}', '${encryptedDoToken.iv}')
  `;
  const result = await client.query(addServerStr);
  return result.rowCount == 1;
};

export const getServerToken = async (client: Client, name: string) => {
  const queryStr = `
    SELECT dotoken, doiv
    FROM servers
    WHERE serverid = '${name}'
  `;
  const result = await client.query(queryStr);
  const data = result.rows[0];
  return decrypt(data.dotoken, data.doiv);
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

export default {
  addServer,
  getServerToken,
  hasServer,
  getForUser,
};
