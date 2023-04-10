import { Request } from "express";
import userService from "../services/users";
import serverService from "../services/servers";
import { databaseHandler } from "../util/controller";
import { Client } from "pg";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
export const onCheckUserSetup = databaseHandler(
  async (req: RequireAuthProp<Request>, client: Client) => {
    const id = req.auth.userId;
    const { server } = await userService.getForUser(client, id);
    if (server == null) return { code: 200, result: false };
    const { isTaken } = await serverService.checkForServer(client, server);
    return { code: 200, result: isTaken };
  }
);

export const onGetUserServer = databaseHandler(
  async (req: RequireAuthProp<Request>, client: Client) => {
    const id = req.auth.userId;
    const result = await userService.getForUser(client, id);
    return { code: 200, result };
  }
);

export const onSetUserServer = databaseHandler(
  async (req: RequireAuthProp<Request>, client: Client) => {
    const name = req.body.server;
    const id = req.auth.userId;
    const result = await userService.setForUser(client, id, name);
    return { code: 200, result };
  }
);

export default {
  onCheckUserSetup,
  onGetUserServer,
  onSetUserServer,
};
