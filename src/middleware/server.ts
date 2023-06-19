import { Request, RequestHandler, Response } from "express";
import { getData } from "../util/network";
import serversService from "../services/servers";
import { dbWrapper } from "../util/database";
import { MiddlewareError } from "../types";

export const requiresServerToExist: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const { serverId } = getData(req, ["serverId"]);
  const exists = await dbWrapper<boolean>(
    async (client) => await serversService.hasServer(client, serverId)
  );
  if (exists) return next();
  return next(new MiddlewareError(400, `No such server with id: ${serverId}`));
};

export const requiresServerToNotExist: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const { serverId } = getData(req, ["serverId"]);
  const exists = await dbWrapper<boolean>(
    async (client) => await serversService.hasServer(client, serverId)
  );
  if (!exists) return next();
  return next(
    new MiddlewareError(400, `There is already a server with id: ${serverId}`)
  );
};
