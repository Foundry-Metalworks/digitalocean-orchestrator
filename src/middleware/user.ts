import { Request, RequestHandler, Response } from "express";
import { getData } from "../util/network";
import { isUserInServer } from "../services/users";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { dbWrapper } from "../util/database";
import { MiddlewareError } from "../types";
import { hasAuthData } from "../services/token";

export const requiresUserInServer: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const reqWithAuth = req as RequireAuthProp<Request>;
  const userId = reqWithAuth.auth.userId;
  const { serverId } = getData(req, ["serverId"]);
  const isInServer = await dbWrapper<boolean>(
    async (client) => await isUserInServer(client, userId, serverId)
  );
  if (isInServer) return next();
  return next(
    new MiddlewareError(400, `User ${userId} is not in server: ${serverId}`)
  );
};

export const requiresUserAuthorized: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const reqWithAuth = req as RequireAuthProp<Request>;
  const userId = reqWithAuth.auth.userId;
  const isAuthorized = await dbWrapper<boolean>(
    async (client) => await hasAuthData(client, userId)
  );
  if (isAuthorized) return next();
  return next(
    new MiddlewareError(400, `User ${userId} is not authorized in DigitalOcean`)
  );
};
