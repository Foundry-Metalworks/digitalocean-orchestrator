import {
  AuthDataType,
  getAuthData,
  regenerateAuthData,
  updateAuthData,
} from "@/services/token";
import { dbWrapper } from "./database";
import { getOwnerId } from "@/services/servers";

export const getUpdatedAuthToken = async (
  serverId: string
): Promise<AuthDataType | null> => {
  const ownerId = await dbWrapper<string | null>(
    async (client) => await getOwnerId(client, serverId)
  );
  if (!ownerId) return null;

  const authData = await dbWrapper<AuthDataType | null>(
    async (client) => await getAuthData(client, ownerId)
  );
  if (!authData) return null;

  if (authData.expiryDate < Date.now()) {
    const newAuthData = await regenerateAuthData(authData.refreshToken);
    await dbWrapper(
      async (client) =>
        await updateAuthData(
          client,
          ownerId,
          newAuthData.doToken,
          newAuthData.refreshToken
        )
    );
    return newAuthData;
  }
  return authData;
};
