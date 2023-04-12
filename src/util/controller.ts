import { Request, RequestHandler } from "express";
import axios, { AxiosInstance } from "axios";
import { connect } from "./database";
import { Client } from "pg";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { getServer } from "../services/servers";
import { getForUser } from "../services/users";

export interface RouteResult {
  code: number;
  result?: unknown;
}

export const tryCatchHandler = (
  func: (req: RequireAuthProp<Request>) => Promise<RouteResult>
): RequestHandler => {
  return async (req, res) => {
    try {
      const result = await func(req as RequireAuthProp<Request>);
      return res.status(result.code).send(result.result);
    } catch (e) {
      return res.status(500).send({ error: JSON.stringify(e) });
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

  return tryCatchHandler(dbRequest);
};

export const digitalOceanHandler = (
  func: (axios: AxiosInstance, server: string) => Promise<RouteResult>
): RequestHandler => {
  const doRequest = async (req: RequireAuthProp<Request>) => {
    const client = await connect();
    const { server } = await getForUser(client, req.auth.userId);
    const doToken = (await getServer(client, server))?.digitalOcean as string;

    const axiosInstance = axios.create({
      baseURL: "https://api.digitalocean.com/v2",
      headers: {
        Authorization: `Bearer ${doToken}`,
      },
    });
    return await func(axiosInstance, server);
  };

  return tryCatchHandler(doRequest);
};
