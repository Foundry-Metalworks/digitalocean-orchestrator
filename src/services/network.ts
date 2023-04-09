import { AxiosInstance } from "axios";
import mapper from "./mapper/network";
import { get, patch, post } from "../util/axios";
import * as dotenv from "dotenv";
dotenv.config();

const ok = "ok";
const domainUrl = `domains/${process.env.BASE_DOMAIN_NAME}/records`;
const fixAuth = (axios: AxiosInstance) => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${process.env.DO_TOKEN}`;
};

const getOrCreateDomainMap = async (
  axios: AxiosInstance,
  name: string,
  ip: string
) => {
  fixAuth(axios);
  let result = await get(axios, domainUrl, {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    type: "A",
  });
  if (result.data.domain_records.length < 1) {
    result = await post(axios, domainUrl, {
      type: "A",
      data: ip,
      name: `${name}.${process.env.SUBDOMAIN_NAME}`,
    });
    return mapper.fromCreateResponse(result.data);
  }

  return mapper.fromIdResponse(result.data);
};

const checkDomain = async (axios: AxiosInstance, name: string) => {
  fixAuth(axios);
  const result = await get(axios, domainUrl, { name, type: "A" });
  return result.data.domain_records.count <= 0;
};

const updateDomain = async (
  axios: AxiosInstance,
  name: string,
  id: string,
  ip: string
) => {
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
