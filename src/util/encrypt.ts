import crypto, { BinaryLike } from "crypto";

const { CRYPTO_ALGO, CRYPTO_KEY } = process.env;

export const encrypt = (value: string) => {
  const iv = crypto.randomBytes(8);
  const cipher = crypto.createCipheriv(
    CRYPTO_ALGO as string,
    Buffer.from(CRYPTO_KEY as string),
    iv as BinaryLike
  );
  var encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { value: encrypted.toString("hex"), iv: iv.toString("hex") };
};

export const decrypt = (value: string, iv: string) => {
  const decipher = crypto.createDecipheriv(
    CRYPTO_ALGO as string,
    Buffer.from(CRYPTO_KEY as string),
    Buffer.from(iv, "hex")
  );
  let decryptedData = decipher.update(value, "hex");
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData.toString();
};
