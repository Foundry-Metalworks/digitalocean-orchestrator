import { MiddlewareError, ROLES } from "../types";
import { RequestHandler, Request, Response } from "express";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import roleService from "../services/roles";
import { dbWrapper } from "../util/database";

export const requiresRole = (role: ROLES): RequestHandler => {
  return async (req: Request, res: Response, next) => {
    const userId = (req as RequireAuthProp<Request>).auth.userId;
    const serverId =
      req.params.serverId || req.body.serverId || req.query.serverId;
    const userRole = await dbWrapper<ROLES>(async (client) => {
      return await roleService.getUserRole(client, userId, serverId);
    });
    if (userRole >= role) return next();
    return next(new MiddlewareError(400, `User lacks required role: ${role}`));
  };
};
