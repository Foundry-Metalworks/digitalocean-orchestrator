import dropletService from "../services/droplets";
import snapshotService from "../services/snapshots";
import networkService from "../services/network";
import { digitalOceanHelper } from "../util/controller";

const onStatusRequest = digitalOceanHelper(async (axios, subdomain) => {
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

const onStopRequest = digitalOceanHelper(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  await dropletService.stopDroplet(axios, id.id);
  await snapshotService.takeSnapshot(axios, subdomain, id.id);
  await dropletService.deleteDroplet(axios, id.id);
  return { code: 200 };
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
  return { code: 200, result };
});

const onIPRequest = digitalOceanHelper(async (axios, subdomain) => {
  const id = await dropletService.getDropletId(axios, subdomain);
  const result = await dropletService.getDropletIP(axios, id.id);
  return { code: 200, result };
});

export default {
  onStatusRequest,
  onStopRequest,
  onStartRequest,
  onIPRequest,
};
