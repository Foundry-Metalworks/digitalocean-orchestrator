import { Request, Response, NextFunction, RequestHandler } from "express";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { getUserInvites, getUserServer } from "../util/user";

export const requiresNewUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as RequireAuthProp<Request>;
  const id = authenticatedReq.auth.userId;
  try {
    const userServer = await getUserServer(id);
    if (userServer) {
      next(Error(`User ${id} already has server: ${userServer}`));
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

export const requiresSetupUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as RequireAuthProp<Request>;
  const id = authenticatedReq.auth.userId;
  try {
    const userServer = await getUserServer(id);
    if (!userServer) {
      return next(Error(`User ${id} is not setup`));
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

export const requiresUserInvited: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const server = req.body.server || req.params.server || req.query.server;
  const authenticatedReq = req as RequireAuthProp<Request>;
  const id = authenticatedReq.auth.userId;
  const servers = await getUserInvites(id);
  if (servers.includes(server)) return next();
  return next(Error(`User ${id} is not invited to server: ${server}`));
};
