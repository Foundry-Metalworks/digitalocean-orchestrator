import { Request } from "express";
import serverService from "../services/servers";
import { databaseHelper } from "../util/controller";
import { Client } from "pg";

export const setServerTokens = databaseHelper(
  async (req: Request, client: Client) => {
    const name = req.body.name;
    const doToken = req.body.doToken;
    const result = await serverService.addServer(client, name, doToken);
    return { code: result ? 200 : 400 };
  }
);

export const getServerTokens = databaseHelper(
  async (req: Request, client: Client) => {
    const name = req.params.name;
    const result = await serverService.getServer(client, name);
    return { code: 200, result };
  }
);

export default {
  getServerTokens,
  setServerTokens,
};
