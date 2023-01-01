import { AxiosInstance } from "axios";
import mapper from "./mapper/network";
import { ServiceFunc } from "../util/service";
import { get, patch, post } from "../util/axios";

const ok = "ok";
const domainUrl = `domains/${process.env.DOMAIN_NAME}/records`;
const fixAuth = (axios: AxiosInstance) => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${process.env.DO_TOKEN}`;
};

const getOrCreateDomainMap: ServiceFunc<[name: string, ip: string]> = async (
  axios: AxiosInstance,
  name: string,
  ip: string
) => {
  fixAuth(axios);
  let result = await get(axios, domainUrl, { name, type: "A" });
  if (result.data.domain_records.count < 1) {
    result = await post(axios, domainUrl, {
      type: "A",
      data: ip,
      name,
    });
  }

  return mapper.fromIdResponse(result.data);
};

const checkDomain: ServiceFunc<[name: string]> = async (
  axios: AxiosInstance,
  name: string
) => {
  fixAuth(axios);
  const result = await get(axios, domainUrl, { name, type: "A" });
  return result.data.domain_records.count <= 0;
};

const updateDomain: ServiceFunc<
  [name: string, id: string, ip: string]
> = async (axios: AxiosInstance, name: string, id: string, ip: string) => {
  fixAuth(axios);
  console.log(`updating network mapping for droplet with id: ${id}`);
  const domainId = await getOrCreateDomainMap(axios, name, ip);
  const data = {
    type: "A",
    data: ip,
  };
  await patch(axios, `${domainUrl}/${domainId.id}`, data);
  console.log(`updated network mapping`);
  return ok;
};

export default {
  checkDomain,
  updateDomain,
};
