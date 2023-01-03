import { NextFunction, Request, Response } from "express";
import axios, { AxiosInstance } from "axios";
import { validationResult } from "express-validator";
import { getUser } from "./auth";

export type RouteResult = {
  code: number;
  result?: unknown;
};

export const validationHelper = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  return next();
};

export const tryCatchHelper = (
  func: (req: Request) => Promise<RouteResult>
) => {
  return async (req: Request, res: Response) => {
    let result;
    try {
      result = await func(req);
    } catch (e) {
      console.log("Request failed");
      console.error(e);
      return res.status(500).send();
    }
    return res.status(result.code).send(result.result);
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const digitalOceanHelper = (
  func: (axios: AxiosInstance, server: string) => Promise<RouteResult>
) => {
  return async (req: Request, res: Response) => {
    let result;
    try {
      const user = await getUser(req);
      const axiosInstance = axios.create({
        url: "https://api.digitalocean.com/v2",
        headers: {
          Authorization: `Bearer ${user.doToken}`,
        },
      });
      result = await func(axiosInstance, user.server);
    } catch (e) {
      console.log("Request failed");
      console.error(e);
      return res.status(500).send();
    }
    return res.status(result.code).send(result.result);
  };
};
