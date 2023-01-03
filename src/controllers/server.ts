import { Request } from "express";
import serverService from "../services/servers";
import { tryCatchHelper } from "../util/controller";

export const setServerTokens = tryCatchHelper(async (req: Request) => {
  const name = req.body.name;
  const doToken = req.body.doToken;
  const result = await serverService.addServer(name, doToken);
  return { code: result ? 200 : 400 };
});

export const getServerTokens = tryCatchHelper(async (req: Request) => {
  const name = req.params.name;
  const result = await serverService.getServer(name);
  return { code: 200, result };
});

export default {
  getServerTokens,
  setServerTokens,
};
