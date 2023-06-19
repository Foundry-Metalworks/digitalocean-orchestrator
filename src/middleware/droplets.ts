import { Request, RequestHandler, Response } from "express";
import { getDropletId, isActionPending } from "../util/droplets";
import { getData, getDOAxiosInstance } from "../util/network";
import { DORequest } from "../types";
import { getServerToken } from "../services/servers";
import { dbWrapper } from "../util/database";

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
  const { serverId } = getData(req, ["serverId"]);
  const token = await dbWrapper<string>(
    async (client) => await getServerToken(client, serverId)
  );
  const axios = getDOAxiosInstance(token);
  const { id } = await getDropletId(axios, serverId);
  req.droplet = { token, server: serverId, id };
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
