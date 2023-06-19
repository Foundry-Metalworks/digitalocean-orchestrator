import { databaseHandler } from "../util/controller";
import serverService from "../services/servers";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getPrimaryEmail } from "../util/clerk";
import { UserType } from "../types";

export const onUserGet = databaseHandler(async (req, client) => {
  const userId = req.auth.userId;
  const clerkUser = await clerkClient.users.getUser(userId);
  const servers = await serverService.getForUser(client, userId);
  const user: UserType = {
    email: getPrimaryEmail(clerkUser),
    name: clerkUser.username || "",
    id: userId,
    servers,
  };
  return { code: 200, result: user };
});

export default {
  onUserGet,
};
