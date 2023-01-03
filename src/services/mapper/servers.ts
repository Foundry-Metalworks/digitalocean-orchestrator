/* eslint-disable  @typescript-eslint/no-explicit-any */
import { decrypt } from "../../util/encrypt";

const fromGetServerResponse = (data: any[]) => {
  return {
    digitalOcean: decrypt(data[0].dotoken, data[0].doiv),
  };
};

export default {
  fromGetResponse: fromGetServerResponse,
};
