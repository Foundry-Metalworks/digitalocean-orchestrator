import { databaseHandler } from "../util/controller";
import invitesService from "../services/invite";
import usersService, { isUserInServer } from "../services/users";
import { ROLES } from "../types";
import { getData } from "../util/network";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getPrimaryEmail } from "../util/clerk";

const onInvitesGetForUser = databaseHandler(async (req, client) => {
  const userId = req.auth.userId;
  const result = await invitesService.getForUser(client, userId);
  return { code: 200, result };
});

const onInvitesGetForServer = databaseHandler(async (req, client) => {
  const serverId = req.params.serverId;
  const result = await invitesService.getForServer(client, serverId);
  return { code: 200, result };
});

const onInviteAccept = databaseHandler(async (req, client) => {
  const userId = req.auth.userId;
  const user = await clerkClient.users.getUser(userId);
  const email = getPrimaryEmail(user);
  const inviteId = req.body.id;
  const invite = await invitesService.getInvite(client, inviteId);
  if (invite) {
    const { serverId, userEmail } = invite;
    if (userEmail != email) {
      return {
        code: 400,
        error: { message: `Invite is not for user: ${userId}` },
      };
    }
    const result =
      (await isUserInServer(client, userId, serverId)) ||
      ((await usersService.addUser(client, userId, serverId, ROLES.USER)) &&
        (await invitesService.removeInvite(client, inviteId)));
    return {
      code: result ? 204 : 500,
      error: result
        ? undefined
        : { message: "The invite is for an invalid server" },
    };
  }
  return {
    code: 400,
    error: { message: `No such invite by that id: ${inviteId}` },
  };
});

const onInviteRemove = databaseHandler(async (req, client) => {
  const { inviteId, serverId } = getData(req, ["inviteId", "serverId"]);
  const invite = await invitesService.getInvite(client, inviteId);
  if (invite) {
    const result = await invitesService.removeInvite(client, invite.id);
    return {
      code: result ? 204 : 500,
      error: result
        ? undefined
        : {
            message: `Failed to remove invite ${inviteId} for server: ${serverId}`,
          },
    };
  }
  return {
    code: 400,
    error: { message: `No such invite by that id: ${inviteId}` },
  };
});

const onInviteCreate = databaseHandler(async (req, client) => {
  const { email, serverId } = getData(req, ["email", "serverId"]);
  const result = await invitesService.addInvite(client, email, serverId);
  return {
    code: result ? 204 : 500,
    error: result
      ? undefined
      : { message: `Failed to create invite for server: ${serverId}` },
  };
});

export default {
  onInvitesGetForUser,
  onInvitesGetForServer,
  onInviteAccept,
  onInviteRemove,
  onInviteCreate,
};
