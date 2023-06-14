import { AxiosInstance } from "axios";
import mapper from "./mapper/snapshots";

const ok = "ok";
const actionUrl = (id: string) => `actions/${id}`;
const dropletActionUrl = (id: string) => `droplets/${id}/actions`;
const snapshotUrl = (id: string) => `snapshots/${id}`;

const getSnapshotId = async (
  axios: AxiosInstance,
  name: string
): Promise<{ id?: string }> => {
  const params = {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    resource_type: "droplet",
  };
  const result = await axios.get("snapshots", { params });

  return mapper.fromIdResponse(result.data);
};

const deleteSnapshot = async (axios: AxiosInstance, id: string) => {
  console.log("Deleting snapshot with id: " + id);
  await axios.delete(snapshotUrl(id));
  console.log("Deleted snapshot");

  return ok;
};

const takeSnapshot = async (
  axios: AxiosInstance,
  name: string,
  dropletId: string
) => {
  const params = {
    type: "snapshot",
    name: `${name}.${process.env.DOMAIN_NAME}`,
  };
  const snapshotResult = await axios.post(dropletActionUrl(dropletId), params);
  const actionId = snapshotResult.data.action.id;

  return { success: snapshotResult.status == 201, actionId };
};

const waitForSnapshot = async (axios: AxiosInstance, actionId: string) => {
  let status = (await axios.get(actionUrl(actionId))).data.action.status;
  while (status != "completed") {
    if (status == "errored") {
      throw Error("Snapshot action failed: " + actionId);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    status = (await axios.get(actionUrl(actionId))).data.action.status;
  }
};

export default {
  takeSnapshot,
  getSnapshotId,
  deleteSnapshot,
  waitForSnapshot,
};
