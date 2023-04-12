import { encrypt } from "../util/encrypt";
import mapper from "./mapper/servers";
import { Client } from "pg";

export const doesServerExist = async (client: Client, name: string) => {
  const queryStr = `
  SELECT name FROM servers
  WHERE name = '${name}'
  `;
  const result = await client.query(queryStr);
  return result.rowCount > 0;
};

export const addServer = async (
  client: Client,
  name: string,
  doToken: string
) => {
  const encryptedDoToken = encrypt(doToken);
  const addServerStr = `
  INSERT INTO servers (name, dotoken, doiv, users)
  VALUES('${name}', '${encryptedDoToken.value}', '${encryptedDoToken.iv}', '{}')
  `;
  const result = await client.query(addServerStr);
  return result.rowCount == 1;
};

export const getServer = async (client: Client, name: string) => {
  const serverExists = await doesServerExist(client, name);
  if (!serverExists) {
    return;
  }
  const queryStr = `
    SELECT dotoken, doiv
    FROM servers
    WHERE name = '${name}'
  `;
  const result = await client.query(queryStr);
  return mapper.fromGetResponse(result.rows);
};

export const addUser = async (client: Client, name: string, user: string) => {
  const serverExists = await doesServerExist(client, name);
  if (!serverExists) {
    return null;
  }
  const queryStr = `UPDATE servers SET users=ARRAY_APPEND(users, '${user}') WHERE name = '${name}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const removeUser = async (
  client: Client,
  name: string,
  user: string
) => {
  const serverExists = await doesServerExist(client, name);
  if (!serverExists) {
    return null;
  }
  const queryStr = `UPDATE servers SET users=ARRAY_REMOVE(users, '${user}'}) WHERE name = '${name}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export default {
  addServer,
  getServer,
  addUser,
  removeUser,
  doesServerExist,
};
