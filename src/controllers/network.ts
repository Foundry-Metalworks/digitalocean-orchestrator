import { digitalOceanHelper } from "../util/controller";
import service from "../services/network";
import { AxiosInstance } from "axios";

const onNameRequest = digitalOceanHelper(
  async (axios: AxiosInstance, subdomain: string) => {
    return await service.checkDomain(axios, subdomain);
  }
);

export default {
  onNameRequest,
};
