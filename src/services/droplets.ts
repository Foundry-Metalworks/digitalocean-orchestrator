import { AxiosInstance } from "axios";
import mapper from "./mapper/droplets";
import { ServiceFunc } from "../util/service";
import { get, post, remove } from "../util/axios";

const ok = "ok";
const dropletBaseUrl = "droplets";
const dropletUrl = (id: string) => `droplets/${id}`;
const dropletActionUrl = (id: string) => `droplets/${id}/actions`;

export const getDropletId: ServiceFunc<[name: string]> = async (
  axios: AxiosInstance,
  name: string
) => {
  const result = await get(axios, dropletBaseUrl, {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    tag_name: "dnd",
  });

  return mapper.fromIdResponse(result.data);
};

const getDropletStatus = async (axios: AxiosInstance, id: string) => {
  const result = await get(axios, dropletUrl(id));

  return mapper.fromStatusResponse(result.data);
};

const killDroplet = async (axios: AxiosInstance, id: string) => {
  await post(axios, dropletActionUrl(id), { type: "power_off" });
  console.log(`killed droplet with id: ${id}`);

  return ok;
};

const waitForStopped = async (axios: AxiosInstance, id: string) => {
  let count = 0;
  let status = await getDropletStatus(axios, id);
  while (status.status != "off") {
    if (count++ == 60) {
      console.log("waited too long, killing...");
      await killDroplet(axios, id);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      status = await getDropletStatus(axios, id);
    }
  }
};

const deleteDroplet = async (axios: AxiosInstance, id: string) => {
  console.log("Deleting droplet with id: " + id);
  await remove(axios, dropletUrl(id));
  console.log("Deleted droplet with id: " + id);
};

const stopDroplet = async (axios: AxiosInstance, id: string) => {
  console.log(`stopping droplet with id: ${id}`);
  await post(axios, dropletActionUrl(id), { type: "shutdown" });
  await waitForStopped(axios, id);
  console.log(`stopped droplet with id: ${id}`);

  return ok;
};

const waitForStarted = async (axios: AxiosInstance, id: string) => {
  const status = await getDropletStatus(axios, id);

  if (status.status != "active") {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await waitForStarted(axios, id);
  }
};

const startDroplet = async (
  axios: AxiosInstance,
  name: string,
  snapshotId: string
) => {
  console.log(`starting droplet from snapshot id: ${snapshotId}`);
  const result = await post(axios, dropletBaseUrl, {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    region: "tor1",
    size: "s-2vcpu-2gb",
    image: snapshotId,
    tags: ["dnd"],
  });
  const id = result.data.droplet.id;
  await waitForStarted(axios, id);
  console.log(`started droplet with id: ${id}`);

  return { id };
};

const getDropletIP = async (axios: AxiosInstance, id: string) => {
  const result = await get(axios, dropletUrl(id));

  return mapper.fromIPResponse(result.data);
};

export default {
  getDropletId,
  getDropletStatus,
  killDroplet,
  stopDroplet,
  deleteDroplet,
  startDroplet,
  getDropletIP,
};
