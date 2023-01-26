import mapper from "./mapper/users";
import { Client } from "pg";

export const getForUser = async (client: Client, email: string) => {
  const queryStr = `
  SELECT server FROM users
  WHERE email = '${email}'
  `;
  const result = await client.query(queryStr);
  return mapper.fromGetResponse(result.rows);
};

export const setForUser = async (
  client: Client,
  email: string,
  name: string
) => {
  const queryStr = `
  INSERT into users (email, server)
  VALUES ('${email}', '${name}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount > 0;
};

export default {
  getForUser,
  setForUser,
};
