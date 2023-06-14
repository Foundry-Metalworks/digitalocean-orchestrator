import dropletService from "../services/droplets";
import snapshotService from "../services/snapshots";
import networkService from "../services/network";
import { digitalOceanHandler } from "../util/controller";
import { isActionPending } from "../util/droplets";
import { DODropletData } from "../types";

const onStatusRequest = digitalOceanHandler(async (axios, droplet) => {
  const { server, id } = droplet;
  const result = await dropletService.getDropletStatus(axios, id);
  const pending = !!id && (await isActionPending(axios, id));
  const snapshot = await snapshotService.getSnapshotId(axios, server);

  const sanitizedResult = pending
    ? { status: "pending" }
    : result.status == "deleted" && !snapshot?.id
    ? { status: "fresh" }
    : result;

  return {
    code: 200,
    result: sanitizedResult,
  };
});

const onStopRequest = digitalOceanHandler(async (axios, droplet) => {
  const completeDroplet = droplet as DODropletData;
  const { server, id } = completeDroplet;

  await dropletService.stopDroplet(axios, id);
  await networkService.removeDomain(server);
  const { id: oldSnapshotId } = await snapshotService.getSnapshotId(
    axios,
    server
  );
  const { success, actionId } = await snapshotService.takeSnapshot(
    axios,
    server,
    id
  );

  snapshotService.waitForSnapshot(axios, actionId).then(() => {
    if (success && oldSnapshotId) {
      snapshotService.deleteSnapshot(axios, oldSnapshotId);
    }
    dropletService.deleteDroplet(axios, id);
  });

  return { code: success ? 200 : 500, result: { actionId } };
});

const onStartRequest = digitalOceanHandler(async (axios, droplet) => {
  const { server } = droplet;
  const snapshotId = await snapshotService.getSnapshotId(axios, server);
  if (snapshotId == null) console.log("First time setup");

  const result = await dropletService.startDroplet(
    axios,
    server,
    snapshotId?.id
  );
  const ip = await dropletService.getDropletIP(axios, result.id);
  await networkService.updateDomain(server, ip.ip);
  return { code: 200, result };
});

const onIPRequest = digitalOceanHandler(async (axios, droplet) => {
  const completeDroplet = droplet as DODropletData;
  const { server, id } = completeDroplet;

  const result = await dropletService.getDropletIP(axios, id);
  const friendlyResult = await dropletService.getFriendlyIP(server, result.ip);
  console.log("result: " + JSON.stringify(friendlyResult));
  return { code: 200, result: friendlyResult };
});

const onSaveRequest = digitalOceanHandler(async (axios, droplet) => {
  const completeDroplet = droplet as DODropletData;
  const { server, id } = completeDroplet;

  const { id: oldSnapshotId } = await snapshotService.getSnapshotId(
    axios,
    server
  );
  const { success, actionId } = await snapshotService.takeSnapshot(
    axios,
    server,
    id
  );

  snapshotService.waitForSnapshot(axios, actionId).then(() => {
    if (success && oldSnapshotId) {
      snapshotService.deleteSnapshot(axios, oldSnapshotId);
    }
  });

  return { code: success ? 200 : 500, result: { actionId } };
});

export default {
  onStatusRequest,
  onStopRequest,
  onStartRequest,
  onIPRequest,
  onSaveRequest,
};
