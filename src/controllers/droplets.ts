import dropletService from "../services/droplets";
import snapshotService from "../services/snapshots";
import networkService from "../services/network";
import { digitalOceanHelper } from "../util/controller";

const onStatusRequest = digitalOceanHelper(async (axios, subdomain) => {
  let id;
  try {
    id = await dropletService.getDropletId(axios, subdomain);
  } catch (e) {
    return { status: "deleted" };
  }
  return await dropletService.getDropletStatus(axios, id.id);
});

const onStopRequest = digitalOceanHelper(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  const result = await dropletService.stopDroplet(axios, id.id);
  await snapshotService.takeSnapshot(axios, subdomain, id.id);
  await dropletService.deleteDroplet(axios, id.id);
  return result;
});

const onStartRequest = digitalOceanHelper(async (axios, subdomain) => {
  const snapshotId = await snapshotService.getSnapshotId(axios, subdomain);
  if (snapshotId == null) throw new Error("Null snapshot id");
  const result = await dropletService.startDroplet(
    axios,
    subdomain,
    snapshotId.id
  );
  const ip = await dropletService.getDropletIP(axios, result.id);
  await networkService.updateDomain(axios, subdomain, result.id, ip.ip);
  return result;
});

const onIPRequest = digitalOceanHelper(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  return await dropletService.getDropletIP(axios, id.id);
});

export default {
  onStatusRequest,
  onStopRequest,
  onStartRequest,
  onIPRequest,
};
