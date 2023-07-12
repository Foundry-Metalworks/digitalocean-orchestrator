import crypto from "crypto";

const { CRYPTO_ALGO, CRYPTO_KEY } = process.env;

const key = crypto
  .createHash("sha512")
  .update(CRYPTO_KEY as string)
  .digest("hex")
  .substring(0, 32);

export const encrypt = (value: string): { value: string; iv: string } => {
  const iv = new Buffer(crypto.randomBytes(8)).toString("hex");
  const cipher = crypto.createCipheriv(CRYPTO_ALGO as string, key, iv);
  const encryptedValue = Buffer.from(
    cipher.update(value, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
  return { value: encryptedValue, iv };
};

export const decrypt = (value: string, iv: string) => {
  const buff = Buffer.from(value, "base64");
  const decipher = crypto.createDecipheriv(CRYPTO_ALGO as string, key, iv);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
};
