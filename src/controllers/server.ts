import serverService from "../services/servers";
import userService from "../services/users";
import { databaseHandler, routeHandler } from "../util/controller";
import { ROLES, ServerType } from "../types";
import { getData } from "../util/network";

export const onServerGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const { serverId } = getData(req, ["serverId"]);
  const permissions = await userService.getUserServerPermissions(
    client,
    id,
    serverId
  );
  const users = await userService.getForServer(client, serverId);
  const result: ServerType = {
    name: serverId,
    permissions,
    users,
  };
  return { code: 200, result };
});

export const onServerCheck = databaseHandler(async (req, client) => {
  const server = req.params.name;
  const exists = await serverService.hasServer(client, server);
  return { code: 200, result: { exists } };
});

export const onServerCreate = databaseHandler(async (req, client) => {
  const { serverId } = getData(req, ["serverId"]);
  const id = req.auth.userId;
  const addServerResult = await serverService.addServer(client, serverId, id);
  const addUserResult = await userService.addUser(
    client,
    id,
    serverId,
    ROLES.OWNER
  );
  return {
    code: addServerResult && addUserResult ? 204 : 500,
  };
});

export const onServerJoin = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const inviteToken = req.body.inviteToken;
  const server = await serverService.getFromToken(client, inviteToken);
  if (!server) {
    return {
      code: 400,
      result: { error: { message: "Token is not valid. Did it expire?" } },
    };
  }
  const addUserResult = await userService.addUser(client, id, server);
  return {
    code: addUserResult ? 200 : 500,
    result: { server },
  };
});

export const onTokenGet = routeHandler(async (req) => {
  const { serverId } = getData(req, ["serverId"]);
  const result = serverService.generateToken(serverId);
  return { code: 200, result };
});

export const onLinkGet = databaseHandler(async (req, client) => {
  const { serverId } = getData(req, ["serverId"]);
  const result = await serverService.generateSingleUseToken(client, serverId);
  if (result) {
    return {
      code: 200,
      result: {
        link: `https://${process.env.DOMAIN_NAME}/join/${result.token}`,
      },
    };
  }
  return {
    code: 500,
    result: { error: { message: "Failed to generate link token" } },
  };
});

export default {
  onServerCreate,
  onServerJoin,
  onServerGet,
  onServerCheck,
  onTokenGet,
  onLinkGet,
};
