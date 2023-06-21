import { Request, RequestHandler, Response } from "express";
import { getDropletId, isActionPending } from "../util/droplets";
import { getData, getDOAxiosInstance } from "../util/network";
import { DORequest, MiddlewareError } from "../types";
import { getUpdatedAuthToken } from "../util/token";

export const withServerInfo: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  const { serverId } = getData(req, ["serverId"]);
  const authData = await getUpdatedAuthToken(serverId);
  if (!authData)
    return next(
      new MiddlewareError(
        500,
        `Failed to get auth data for server: ${serverId}`
      )
    );

  const axios = getDOAxiosInstance(authData.doToken);
  const { id } = await getDropletId(axios, serverId);
  req.droplet = { token: authData.doToken, server: serverId, id };
  return next();
};

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
