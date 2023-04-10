import dropletService, { getDropletId } from "../services/droplets";
import snapshotService from "../services/snapshots";
import networkService from "../services/network";
import { digitalOceanHandler } from "../util/controller";
import { AxiosInstance } from "axios";
import service from "../services/snapshots";

const onStatusRequest = digitalOceanHandler(async (axios, subdomain) => {
  let id;
  try {
    id = await dropletService.getDropletId(axios, subdomain);
  } catch (e) {
    return { code: 200, result: { status: "deleted" } };
  }
  const result = await dropletService.getDropletStatus(axios, id.id);
  return {
    code: 200,
    result,
  };
});

const onStopRequest = digitalOceanHandler(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  await dropletService.stopDroplet(axios, id.id);
  await snapshotService.takeSnapshot(axios, subdomain, id.id);
  await dropletService.deleteDroplet(axios, id.id);
  await networkService.removeDomain(subdomain);
  return { code: 200 };
});

const onStartRequest = digitalOceanHandler(async (axios, subdomain) => {
  const snapshotId = await snapshotService.getSnapshotId(axios, subdomain);
  if (snapshotId == null) console.log("First time setup");

  const result = await dropletService.startDroplet(
    axios,
    subdomain,
    snapshotId?.id
  );
  const ip = await dropletService.getDropletIP(axios, result.id);
  await networkService.updateDomain(subdomain, ip.ip);
  return { code: 200, result };
});

const onIPRequest = digitalOceanHandler(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  const result = await dropletService.getDropletIP(axios, id.id);
  const friendlyResult = await dropletService.getFriendlyIP(
    subdomain,
    result.ip
  );
  console.log("result: " + JSON.stringify(friendlyResult));
  return { code: 200, result: friendlyResult };
});

const onSaveRequest = digitalOceanHandler(
  async (axios: AxiosInstance, subdomain: string) => {
    const dropletId = (await getDropletId(axios, subdomain)).id;
    const result = await service.takeSnapshot(axios, subdomain, dropletId);
    return { code: 200, result };
  }
);

export default {
  onStatusRequest,
  onStopRequest,
  onStartRequest,
  onIPRequest,
  onSaveRequest,
};
