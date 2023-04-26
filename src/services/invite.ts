import { Client } from "pg";

export const addEmail = async (
  client: Client,
  server: string,
  email: string
) => {
  const queryStr = `
  INSERT INTO invites (email, server)
  VALUES('${email}', '${server}')
  `;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const getForEmail = async (client: Client, email: string) => {
  const queryStr = `SELECT server FROM invites WHERE email = '${email}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1 ? result.rows[0].server : null;
};

export const removeEmail = async (client: Client, email: string) => {
  const queryStr = `DELETE FROM invites WHERE email = '${email}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export default {
  addEmail,
  getForEmail,
  removeEmail,
};
