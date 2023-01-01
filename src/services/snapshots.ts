import { AxiosInstance } from "axios";
import mapper from "./mapper/snapshots";
import { ServiceFunc } from "../util/service";
import { get, post, remove } from "../util/axios";

const ok = "ok";
const actionUrl = (id: string) => `actions/${id}`;
const dropletActionUrl = (id: string) => `droplets/${id}/actions`;
const snapshotUrl = (id: string) => `snapshots/${id}`;

const getSnapshotId: ServiceFunc<[string]> = async (
  axios: AxiosInstance,
  name: string
) => {
  const result = await get(axios, "snapshots", {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    resource_type: "droplet",
  });

  return mapper.fromIdResponse(result.data);
};

const deleteSnapshot: ServiceFunc<[string]> = async (
  axios: AxiosInstance,
  id: string
) => {
  console.log("Deleting snapshot with id: " + id);
  await remove(axios, snapshotUrl(id));
  console.log("Deleted snapshot");

  return ok;
};

const takeSnapshot: ServiceFunc<[string, string]> = async (
  axios: AxiosInstance,
  name: string,
  dropletId: string
) => {
  const oldSnapshotId = await getSnapshotId(axios, name);
  const snapshotResult = await post(axios, dropletActionUrl(dropletId), {
    type: "snapshot",
    name: `${name}.${process.env.DOMAIN_NAME}`,
  });
  const actionId = snapshotResult.data.action.id;

  if (oldSnapshotId != null) {
    await deleteSnapshot(axios, oldSnapshotId.id);
  }

  console.log("Taking snapshot of droplet with id: " + dropletId);
  let status = (await get(axios, actionUrl(actionId))).data.action.status;
  while (status != "completed") {
    console.log("Waiting for completion, action status currently: " + status);
    if (status == "errored") {
      throw Error("Failed to take snapshot of droplet with id: " + dropletId);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    status = (await get(axios, actionUrl(actionId))).data.action.status;
  }
  console.log("Took snapshot");

  return ok;
};

export default {
  takeSnapshot,
  getSnapshotId,
  deleteSnapshot,
};
