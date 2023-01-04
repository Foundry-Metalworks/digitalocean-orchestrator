import { encrypt } from "../util/encrypt";
import mapper from "./mapper/servers";
import sql from "../datasource/auth";

export const isNameTaken = async (name: string) => {
  const query = `
  SELECT name FROM servers
  WHERE name = '${name}'
  `;
  const result = await sql.query(query);
  return result.rowCount > 0;
};

export const addServer = async (name: string, doToken: string) => {
  if (await isNameTaken(name)) {
    return false;
  }
  const encryptedDoToken = encrypt(doToken);
  const query = `
  INSERT INTO servers (name, dotoken, doiv)
  VALUES('${name}', '${encryptedDoToken.value}', '${encryptedDoToken.iv}')
  `;
  await sql.query(query);
  return true;
};

export const getServer = async (name: string) => {
  const client = await sql.connect();
  if (!(await isNameTaken(name))) {
    return null;
  }
  const query = `
    SELECT dotoken, doiv
    FROM servers
    WHERE name = '${name}'
  `;
  const result = await client.query(query);
  return mapper.fromGetResponse(result.rows);
};

export default {
  addServer,
  getServer,
};
