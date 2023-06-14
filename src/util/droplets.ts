import { AxiosInstance } from "axios";
import { connect } from "./database";
import { getForUser } from "../services/users";
import { getServer } from "../services/servers";
import process from "process";
import mapper from "../services/mapper/droplets";

const dropletActionUrl = (id: string) => `droplets/${id}/actions`;

export const getDoServerInfo = async (
  userId: string
): Promise<{ token: string; server: string } | null> => {
  const client = await connect();
  const { server } = await getForUser(client, userId);
  if (!server) return null;
  const token = (await getServer(client, server))?.digitalOcean as string;
  await client.end();
  return { token, server };
};

export const isActionPending = async (
  doAxiosInstance: AxiosInstance,
  dropletId: string
) => {
  const actionsResult = await doAxiosInstance.get(dropletActionUrl(dropletId));
  const actions: { id: string; status: string }[] = actionsResult.data.actions;

  return !!actions.find((a) => a.status != "completed");
};

export const getDropletId = async (
  axios: AxiosInstance,
  name: string
): Promise<{ id?: string }> => {
  const params = { name: `${name}.${process.env.DOMAIN_NAME}` };
  const result = await axios.get("/droplets", { params });
  return mapper.fromIdResponse(result.data);
};
