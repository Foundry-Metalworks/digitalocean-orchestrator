import { digitalOceanHelper } from "../util/controller";
import { getDropletId } from "../services/droplets";
import service from "../services/snapshots";
import { AxiosInstance } from "axios";

const onSaveRequest = digitalOceanHelper(
  async (axios: AxiosInstance, subdomain: string) => {
    const dropletId = (await getDropletId(axios, subdomain)).id;
    return await service.takeSnapshot(axios, subdomain, dropletId);
  }
);

export default {
  onSaveRequest,
};
