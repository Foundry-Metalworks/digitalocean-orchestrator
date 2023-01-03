/* eslint-disable  @typescript-eslint/no-explicit-any */
import { decrypt } from "../../util/encrypt";

const fromGetServerResponse = (data: any[]) => {
  return {
    digitalOcean: decrypt(data[0].dotoken, data[0].doiv),
  };
};

const fromGetUserResponse = (data: any[]) => {
  return {
    server: data.length > 0 ? data[0].server : null,
  };
};

export default {
  server: {
    fromGetResponse: fromGetServerResponse,
  },
  user: {
    fromGetResponse: fromGetUserResponse,
  },
};
