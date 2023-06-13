import { connect } from "./database";
import userService from "../services/users";
import inviteService from "../services/invite";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const getUserServer = async (
  id: string
): Promise<string | undefined> => {
  const client = await connect();
  try {
    const { server: userServer } = await userService.getForUser(client, id);
    await client.end();
    return userServer;
  } catch (e) {
    await client.end();
    throw e;
  }
};

export const getUserEmail = async (id: string): Promise<string> => {
  const { emailAddresses, primaryEmailAddressId } =
    await clerkClient.users.getUser(id);
  const primaryEmail =
    emailAddresses.find((e) => e.id == primaryEmailAddressId) ||
    emailAddresses[0];
  return primaryEmail?.emailAddress;
};

export const getUserInvites = async (id: string): Promise<string[]> => {
  const email = await getUserEmail(id);
  const client = await connect();
  try {
    const servers = await inviteService.getForEmail(client, email);
    await client.end();
    return servers;
  } catch (e) {
    await client.end();
    throw e;
  }
};
