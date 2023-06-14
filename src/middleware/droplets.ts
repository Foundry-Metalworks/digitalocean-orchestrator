import { Request, RequestHandler, Response } from "express";
import {
  getDoServerInfo,
  getDropletId,
  isActionPending,
} from "../util/droplets";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { getDOAxiosInstance } from "../util/network";
import { DORequest } from "../types";

export const requireNoActions: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const doRequest = req as DORequest;
  const { token, server, id } = doRequest.droplet;
  const axios = getDOAxiosInstance(token);
  if (id == null) return next();

  const isPending = await isActionPending(axios, id);
  if (isPending) {
    return next(Error(`Server: ${server} has pending droplet actions`));
  }
  return next();
};

export const withServerInfo: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const reqWithAuth = req as RequireAuthProp<Request>;
  const { token, server } = await getDoServerInfo(reqWithAuth.auth.userId);
  const axios = getDOAxiosInstance(token);
  const { id } = await getDropletId(axios, server);
  req.droplet = { token, server, id };
  return next();
};

export const requireDroplet: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const doRequest = req as DORequest;
  const { server, id } = doRequest.droplet;
  if (!id) {
    return next(Error(`No droplet exists for server: ${server}`));
  }
  return next();
};
