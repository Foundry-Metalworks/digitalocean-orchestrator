import { Client } from "pg";

export const addEmail = async (
  client: Client,
  server: string,
  email: string
) => {
  const servers = await getForEmail(client, email);
  if (!!servers && servers.includes(server)) return true;
  const queryStr =
    servers != null
      ? `UPDATE invites SET servers=ARRAY_APPEND(servers, '${server}') WHERE email = '${email}'`
      : `INSERT INTO invites (email, servers) VALUES ('${email}', '{${server}}')`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const getForEmail = async (
  client: Client,
  email: string
): Promise<string[]> => {
  const queryStr = `SELECT servers FROM invites WHERE email = '${email}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1 ? result.rows[0].servers : [];
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
