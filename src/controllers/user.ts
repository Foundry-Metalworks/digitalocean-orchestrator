import { Request } from "express";
import serverService from "../services/users";
import { tryCatchHelper } from "../util/controller";
import { getUser } from "../util/auth";

export const userHasServer = tryCatchHelper(async (req: Request) => {
  const user = await getUser(req);
  const result = await serverService.getForUser(user.email);
  return { code: 200, result: result.server != null };
});

export const getUserServer = tryCatchHelper(async (req: Request) => {
  const user = await getUser(req);
  const result = await serverService.getForUser(user.email);
  return { code: 200, result };
});

export const setUserServer = tryCatchHelper(async (req: Request) => {
  const name = req.body.server;
  const user = await getUser(req);
  const result = await serverService.setForUser(user.email, name);
  return { code: 200, result };
});

export default {
  userHasServer,
  getUserServer,
  setUserServer,
};
