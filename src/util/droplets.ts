import { AxiosInstance } from "axios";
import process from "process";
import mapper from "../services/mapper/droplets";

const dropletActionUrl = (id: string) => `droplets/${id}/actions`;

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
