import cache from "memory-cache";
import voucherCodes from "voucher-code-generator";

const tokenCache = new cache.Cache();
const TOKEN_EXPIRE_TIME = 15000;
const TOKEN_LENGTH = 8;

export const generateToken = (server: string) => {
  const [token] = voucherCodes.generate({
    length: TOKEN_LENGTH,
    charset: voucherCodes.charset("alphanumeric"),
    count: 1,
  });
  tokenCache.put(token, server, TOKEN_EXPIRE_TIME);
  return { token };
};

export const getServerFromToken = (token: string) => {
  const storedServer = tokenCache.get(token);
  return storedServer as string | null;
};

export default { generateToken, getServerFromToken };
