import serverService from "../services/servers";
import userService from "../services/users";
import tokenService from "../services/token";
import inviteService from "../services/invite";
import { databaseHandler } from "../util/controller";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getUserServer } from "../util/user";

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
        error: { message: `Server already exists: ${name}` },
      },
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
  const server = await tokenService.getServerFromToken(client, inviteToken);
  if (!server) {
    return {
      code: 400,
      result: { error: { message: "Token is not valid. Did it expire?" } },
    };
  }
  const inviteUserResult = await serverService.addUser(client, server, id);
  const addUserResult = await userService.addUser(client, id, server);
  return {
    code: inviteUserResult && addUserResult ? 200 : 500,
    result: { server },
  };
});

export const onServerInvite = databaseHandler(async (req, client) => {
  const email = req.body.email;
  const id = req.auth.userId;
  const { server } = await userService.getForUser(client, id);
  if (!server)
    return { code: 400, result: { error: { message: "User not set up" } } };
  // Account invite if no account
  const count = await clerkClient.users.getCount({ emailAddress: [email] });
  if (!count) {
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
    });
  } else {
    // Don't invite if already in a server
    const { id } = (
      await clerkClient.users.getUserList({ emailAddress: [email] })
    )[0];
    const userServer = getUserServer(id);
    if (userServer) {
      return {
        code: 400,
        result: {
          error: { message: `User already in a server: ${userServer}` },
        },
      };
    }
  }
  // Server invite
  const inviteResult = await inviteService.addEmail(client, server, email);
  return { code: inviteResult ? 200 : 500 };
});

export const onTokenGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const { server } = await userService.getForUser(client, id);
  const result = tokenService.generateToken(server);
  return { code: 200, result };
});

export const onLinkGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const { server } = await userService.getForUser(client, id);
  const result = await tokenService.generateSingleUseToken(client, server);
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

export const onCheckForServer = databaseHandler(async (req, client) => {
  const name = req.params.name;
  const result = !!(await serverService.getServer(client, name));
  return { code: 200, result };
});

export default {
  onServerCreate,
  onServerJoin,
  onServerInvite,
  onServerGet,
  onTokenGet,
  onLinkGet,
  onCheckForServer,
};
