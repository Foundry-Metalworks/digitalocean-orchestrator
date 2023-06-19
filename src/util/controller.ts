import { Request, RequestHandler } from "express";
import { AxiosInstance } from "axios";
import { connect } from "./database";
import { Client } from "pg";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { getDOAxiosInstance } from "./network";
import { DOData, DORequest } from "../types";

export interface RouteResult {
  code: number;
  result?: unknown;
  error?: { message: string; stack?: never };
}

export const routeHandler = (
  func: (req: RequireAuthProp<Request>) => Promise<RouteResult>
): RequestHandler => {
  return async (req, res) => {
    try {
      const result = await func(req as RequireAuthProp<Request>);
      if (result.error) {
        return res.status(result.code).send(result.error);
      }
      return res.status(result.code).send(result.result);
    } catch (e) {
      const error = e as Error;
      return res
        .status(500)
        .send({ error: { message: error.message, stack: error.stack } });
    }
  };
};

export const databaseHandler = (
  func: (req: RequireAuthProp<Request>, client: Client) => Promise<RouteResult>
): RequestHandler => {
  const dbRequest = async (req: RequireAuthProp<Request>) => {
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

  return routeHandler(dbRequest);
};

export const digitalOceanHandler = (
  func: (axios: AxiosInstance, droplet: DOData) => Promise<RouteResult>
): RequestHandler => {
  const doRequest = async (req: Request) => {
    const doRequest = req as DORequest;
    const { token } = doRequest.droplet;

    const axiosInstance = getDOAxiosInstance(token);
    return await func(axiosInstance, doRequest.droplet);
  };

  return routeHandler(doRequest);
};
