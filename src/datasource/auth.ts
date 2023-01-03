import * as dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const { NODE_ENV, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } =
  process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}${
  ENDPOINT_ID ? `?options=project%3D${ENDPOINT_ID}` : ""
}`;
const sql = new Pool({
  connectionString: URL,
  ssl: NODE_ENV != "development",
});

export default sql;
