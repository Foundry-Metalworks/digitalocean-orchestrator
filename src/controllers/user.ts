import { databaseHandler } from "../util/controller";
import serverService from "../services/servers";
import tokenService from "../services/token";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getPrimaryEmail } from "../util/clerk";
import { UserType } from "../types";
import { getData } from "../util/network";

export const onUserGet = databaseHandler(async (req, client) => {
  const userId = req.auth.userId;
  const clerkUser = await clerkClient.users.getUser(userId);
  const servers = await serverService.getForUser(client, userId);
  const authorized = await tokenService.hasAuthData(client, userId);
  const user: UserType = {
    email: getPrimaryEmail(clerkUser),
    name: clerkUser.username || "",
    id: userId,
    servers,
    authorized,
  };
  return { code: 200, result: user };
});

export const onUserAuthorize = databaseHandler(async (req, client) => {
  const { code } = getData(req, ["code"]);
  const userId = req.auth.userId;
  const { doToken, refreshToken } = await tokenService.generateAuthData(code);
  const hasData = await tokenService.hasAuthData(client, userId);
  let result;
  if (hasData) {
    result = await tokenService.updateAuthData(
      client,
      userId,
      doToken,
      refreshToken
    );
  } else {
    result = await tokenService.addAuthData(
      client,
      userId,
      doToken,
      refreshToken
    );
  }
  return {
    code: result ? 204 : 500,
    error: result ? undefined : { message: "Failed to store auth data" },
  };
});

export default {
  onUserGet,
  onUserAuthorize,
};
