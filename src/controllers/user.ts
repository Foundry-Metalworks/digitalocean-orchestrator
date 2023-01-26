import { Request } from "express";
import serverService from "../services/users";
import { databaseHelper } from "../util/controller";
import { getUser } from "../util/auth";
import { Client } from "pg";

export const userHasServer = databaseHelper(
  async (req: Request, client: Client) => {
    const user = await getUser(req);
    const result = await serverService.getForUser(client, user.email);
    return { code: 200, result: result.server != null };
  }
);

export const getUserServer = databaseHelper(
  async (req: Request, client: Client) => {
    const user = await getUser(req);
    const result = await serverService.getForUser(client, user.email);
    return { code: 200, result };
  }
);

export const setUserServer = databaseHelper(
  async (req: Request, client: Client) => {
    const name = req.body.server;
    const user = await getUser(req);
    const result = await serverService.setForUser(client, user.email, name);
    return { code: 200, result };
  }
);

export default {
  userHasServer,
  getUserServer,
  setUserServer,
};
