import { databaseHandler } from "../util/controller";
import inviteService from "../services/invite";
import { getUserEmail } from "../util/user";
import serverService from "../services/servers";
import userService from "../services/users";

export const onInvitesGet = databaseHandler(async (req, client) => {
  const id = req.auth.userId;
  const email = await getUserEmail(id);
  const invites = await inviteService.getForEmail(client, email);
  return { code: 200, result: { invites } };
});

export const onInviteAccept = databaseHandler(async (req, client) => {
  const server = req.body.server;
  const id = req.auth.userId;

  const inviteUserResult = await serverService.addUser(client, server, id);
  const addUserResult = await userService.addUser(client, id, server);
  const isSuccess = inviteUserResult && addUserResult;
  return { code: isSuccess ? 200 : 500, result: { server } };
});

export default {
  onInvitesGet,
  onInviteAccept,
};
