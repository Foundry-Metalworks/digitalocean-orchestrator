import mapper from "./mapper/users";
import { Client } from "pg";

export const getForUser = async (client: Client, id: string) => {
  const queryStr = `
  SELECT server FROM users
  WHERE id = '${id}'
  `;
  console.log("querying for user with id: " + id);
  const result = await client.query(queryStr);
  console.log("got response: " + JSON.stringify(result));
  return mapper.fromGetResponse(result.rows);
};

export const addUser = async (client: Client, id: string, name: string) => {
  const queryStr = `
  INSERT into users (id, server)
  VALUES ('${id}', '${name}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export default {
  getForUser,
  addUser,
};
