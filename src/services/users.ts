import mapper from "./mapper/users";
import { Client } from "pg";

export const getForUser = async (client: Client, id: string) => {
  const queryStr = `
  SELECT server FROM users
  WHERE id = '${id}'
  `;
  const result = await client.query(queryStr);
  return mapper.fromGetResponse(result.rows);
};

export const setForUser = async (client: Client, id: string, name: string) => {
  const queryStr = `
  INSERT into users (id, server)
  VALUES ('${id}', '${name}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount > 0;
};

export default {
  getForUser,
  setForUser,
};
