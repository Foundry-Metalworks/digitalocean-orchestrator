import { Client } from "pg";
import { decrypt, encrypt } from "../util/encrypt";
import axios from "axios";

const TOKEN_EXPIRY = 2590000000;

const getGenerateTokenUrl = (authCode: string) => {
  return `https://cloud.digitalocean.com/v1/oauth/token?client_id=${process.env.DO_CLIENT_ID}&client_secret=${process.env.DO_CLIENT_SECRET}&grant_type=authorization_code&code=${authCode}&redirect_uri=${process.env.DO_CALLBACK_URL}`;
};
const getRegenerateTokenUrl = (refreshToken: string) => {
  return `ttps://cloud.digitalocean.com/v1/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`;
};

export const generateAuthData = async (
  authCode: string
): Promise<{ doToken: string; refreshToken: string }> => {
  const url = getGenerateTokenUrl(authCode);
  const result = await axios.post(url);
  const { access_token: doToken, refresh_token: refreshToken } = result.data;
  return { doToken, refreshToken };
};

export const regenerateAuthData = async (
  refreshToken: string
): Promise<AuthDataType> => {
  const url = getRegenerateTokenUrl(refreshToken);
  const result = await axios.post(url);
  const { access_token: doToken, refresh_token } = result.data;
  return {
    doToken,
    refreshToken: refresh_token,
    expiry: Date.now() + TOKEN_EXPIRY,
  };
};

export const addAuthData = async (
  client: Client,
  userId: string,
  doToken: string,
  refreshToken: string
): Promise<boolean> => {
  const { value: encryptedDoToken, iv: doIv } = encrypt(doToken);
  const { value: encryptedRefreshToken, iv: refreshIv } = encrypt(refreshToken);
  const expiryDate = Date.now() + TOKEN_EXPIRY;
  const queryStr = `INSERT INTO tokens (userid, dotoken, doiv, refreshtoken, refreshiv, expiryDate)
                    VALUES ('${userId}', '${encryptedDoToken}', '${doIv}', '${encryptedRefreshToken}', '${refreshIv}', '${expiryDate}')`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export const updateAuthData = async (
  client: Client,
  userId: string,
  doToken: string,
  refreshToken: string
): Promise<boolean> => {
  const { value: encryptedDoToken, iv: doIv } = encrypt(doToken);
  const { value: encryptedRefreshToken, iv: refreshIv } = encrypt(refreshToken);
  const expiryDate = Date.now() + TOKEN_EXPIRY;
  const queryStr = `UPDATE tokens
                    SET doToken='${encryptedDoToken}', doIv='${doIv}', refreshToken='${encryptedRefreshToken}', refreshIv='${refreshIv}', expiryDate='${expiryDate}'
                    WHERE userId='${userId}'`;
  const result = await client.query(queryStr);
  return result.rowCount == 1;
};

export type AuthDataType = {
  doToken: string;
  refreshToken: string;
  expiry: number;
};

export const hasAuthData = async (
  client: Client,
  userId: string
): Promise<boolean> => {
  const queryStr = `SELECT EXISTS(SELECT 1 FROM tokens WHERE userId = '${userId}')`;
  const result = await client.query<{ exists: boolean }>(queryStr);
  return !!result.rowCount && result.rows[0].exists;
};

export const getAuthData = async (
  client: Client,
  userId: string
): Promise<AuthDataType | null> => {
  const queryStr = `SELECT dotoken, doiv, refreshtoken, refreshiv, expiryDate FROM tokens WHERE userId = '${userId}'`;
  const result = await client.query(queryStr);
  if (result.rowCount) {
    const data = result.rows[0];
    const doToken = decrypt(data.dotoken, data.doiv);
    const refreshToken = decrypt(data.refreshtoken, data.refreshiv);
    const expiry = data.expiryDate;
    return { doToken, refreshToken, expiry };
  }
  return null;
};

export default {
  generateAuthData,
  regenerateAuthData,
  getAuthData,
  addAuthData,
  updateAuthData,
  hasAuthData,
};
