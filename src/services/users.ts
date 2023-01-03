import mapper from "./mapper/users";
import sql from "../datasource/auth";

export const getForUser = async (email: string) => {
  const query = `
  SELECT server FROM users
  WHERE email = '${email}'
  `;
  const result = await sql.query(query);
  return mapper.fromGetResponse(result.rows);
};

export const setForUser = async (email: string, name: string) => {
  const query = `
  INSERT into users (email, server)
  VALUES ('${email}', '${name}')
  `;
  await sql.query(query);
};

export default {
  getForUser,
  setForUser,
};
