import { Request } from "express";
import serverService from "../services/servers";
import { databaseHelper } from "../util/controller";
import { Client } from "pg";

export const checkServerExists = databaseHelper(
  async (req: Request, client: Client) => {
    const name = req.params.name;
    const result = await serverService.checkForServer(client, name);
    console.log("exists: " + JSON.stringify(result));
    return { code: 200, result };
  }
);

export const setServerInfo = databaseHelper(
  async (req: Request, client: Client) => {
    const name = req.body.name;
    const doToken = req.body.doToken;
    const result = await serverService.addServer(client, name, doToken);
    return { code: result ? 200 : 400 };
  }
);

export default {
  setServerInfo,
  checkServerExists,
};
