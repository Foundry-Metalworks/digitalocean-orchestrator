import serverService from "../services/servers";
import userService from "../services/users";
import tokenService from "../services/token";
import { databaseHandler } from "../util/controller";

export const onServerGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const result = await userService.getForUser(client, id);
  return { code: 200, result };
});

export const onServerCreate = databaseHandler(async (req, client) => {
  const name = req.body.name;
  const doToken = req.body.doApiToken;
  const id = req.auth.userId;
  console.log(
    `creating server: ${name} with token: ${doToken} for user: ${id}`
  );
  const serverExists = await serverService.doesServerExist(client, name);
  console.log("exists: " + serverExists);
  if (serverExists) {
    return {
      code: 400,
      result: {
        error: `Server already exists: ${name}`,
      },
    };
  }
  const { server: userServer } = await userService.getForUser(client, id);
  console.log("userServer: " + userServer);
  if (userServer) {
    return {
      code: 400,
      result: { error: `User already in a server: ${userServer}` },
    };
  }
  console.log("adding server");
  const addServerResult = await serverService.addServer(client, name, doToken);
  console.log("inviting user to server");
  const inviteUserResult = await serverService.addUser(client, name, id);
  console.log("adding user");
  const addUserResult = await userService.addUser(client, id, name);
  console.log("completed");
  return {
    code: addServerResult && inviteUserResult && addUserResult ? 200 : 500,
  };
});

export const onServerJoin = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const inviteToken = req.body.inviteToken;
  const server = await tokenService.getServerFromToken(inviteToken);
  if (!server) {
    return {
      code: 400,
      result: { error: "Token is not valid. Did it expire?" },
    };
  }
  const serverExists = await serverService.doesServerExist(client, server);
  if (!serverExists) {
    return {
      code: 500,
      result: {
        error:
          "Something went really bad. The token is associated with a server but the server doesn't exist",
      },
    };
  }
  const { server: userServer } = await userService.getForUser(client, id);
  if (userServer) {
    return {
      code: 400,
      result: { error: `User already in a server: ${userServer}` },
    };
  }
  const inviteUserResult = await serverService.addUser(client, server, id);
  const addUserResult = await userService.addUser(client, id, server);
  return {
    code: inviteUserResult && addUserResult ? 200 : 500,
    result: { server },
  };
});

export const onTokenGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const { server } = await userService.getForUser(client, id);
  if (!server) return { code: 400, result: { error: `User not set up` } };
  const result = tokenService.generateToken(server);
  return { code: 200, result };
});

export const onCheckForServer = databaseHandler(async (req, client) => {
  const name = req.params.name;
  const result = !!(await serverService.getServer(client, name));
  return { code: 200, result };
});

export default {
  onServerCreate,
  onServerJoin,
  onServerGet,
  onTokenGet,
  onCheckForServer,
};
