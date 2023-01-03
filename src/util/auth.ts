import { Request } from "express";
import { AuthenticationClient, User } from "auth0";
import * as dotenv from "dotenv";
import { getForUser } from "../services/users";
import { getServer } from "../services/servers";

dotenv.config();

const auth0 = new AuthenticationClient({
  domain: process.env.CLIENT_DOMAIN as string,
  clientId: process.env.CLIENT_ID as string,
});

type AuthUser = {
  authToken: string;
  email: string;
  server: string;
  doToken: string;
};

export async function getUser(req: Request): Promise<AuthUser> {
  const authToken = req.auth?.token as string;
  const user = (await auth0.users?.getInfo(authToken)) as User;
  const email = user.email as string;
  const server = (await getForUser(email)).server;
  const doToken = (await getServer(server))?.digitalOcean as string;
  return {
    authToken,
    email,
    server,
    doToken,
  };
}

export default auth0;
