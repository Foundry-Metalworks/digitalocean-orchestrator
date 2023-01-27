import { NextFunction, Request, Response } from "express";
import axios, { AxiosInstance } from "axios";
import { connect } from "./database";
import { validationResult } from "express-validator";
import { getUser } from "./auth";
import { Client } from "pg";

export interface RouteResult {
  code: number;
  result?: unknown;
}

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
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await func(req);
      res.status(result.code).send(result.result);
    } catch (e) {
      next(e);
    }
  };
};

export const databaseHelper = (
  func: (req: Request, client: Client) => Promise<RouteResult>
) => {
  const dbRequest = async (req: Request) => {
    const client = await connect();
    try {
      const result = await func(req, client);
      await client.end();
      return result;
    } catch (e) {
      await client.end();
      throw e;
    }
  };

  return tryCatchHelper(dbRequest);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const digitalOceanHelper = (
  func: (axios: AxiosInstance, server: string) => Promise<RouteResult>
) => {
  const doRequest = async (req: Request) => {
    const user = await getUser(req);
    const axiosInstance = axios.create({
      baseURL: "https://api.digitalocean.com/v2",
      headers: {
        Authorization: `Bearer ${user.doToken}`,
      },
    });
    return await func(axiosInstance, user.server);
  };

  return tryCatchHelper(doRequest);
};
