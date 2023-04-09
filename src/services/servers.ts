import { encrypt } from "../util/encrypt";
import mapper from "./mapper/servers";
import { Client } from "pg";

export const isNameTaken = async (client: Client, name: string) => {
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
  if (await isNameTaken(client, name)) {
    return false;
  }
  const encryptedDoToken = encrypt(doToken);
  const queryStr = `
  INSERT INTO servers (name, dotoken, doiv)
  VALUES('${name}', '${encryptedDoToken.value}', '${encryptedDoToken.iv}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount > 0;
};

export const checkForServer = async (client: Client, name: string) => {
  const isTaken = await isNameTaken(client, name);
  return { server: name, isTaken };
};

export const getServer = async (client: Client, name: string) => {
  if (!(await isNameTaken(client, name))) {
    return null;
  }
  const queryStr = `
    SELECT dotoken, doiv
    FROM servers
    WHERE name = '${name}'
  `;
  const result = await client.query(queryStr);
  return mapper.fromGetResponse(result.rows);
};

export default {
  addServer,
  getServer,
  checkForServer,
};
