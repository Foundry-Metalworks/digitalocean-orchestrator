import mapper from "./mapper/network";
import * as dotenv from "dotenv";
import axios from "axios";
import process from "process";
dotenv.config();

const ok = "ok";
const domainUrl = `domains/${process.env.BASE_DOMAIN_NAME}/records`;

const networkAPI = axios.create({
  baseURL: "https://api.digitalocean.com/v2",
  headers: {
    Authorization: `Bearer ${process.env.DO_TOKEN}`,
  },
});

const getDomainMap = async (name: string, ip?: string) => {
  let result = await networkAPI.get(domainUrl, {
    params: {
      name: `${name}.${process.env.DOMAIN_NAME}`,
      type: "A",
    },
  });
  if (!!ip && result.data.domain_records.length < 1) {
    result = await networkAPI.post(domainUrl, {
      type: "A",
      data: ip,
      ttl: 300,
      name: `${name}.${process.env.SUBDOMAIN_NAME}`,
    });
    return mapper.fromCreateResponse(result.data);
  }

  return mapper.fromIdResponse(result.data);
};

const checkDomain = async (name: string) => {
  const params = { name, type: "A" };
  const result = await networkAPI.get(domainUrl, { params });
  return result.data.domain_records.count <= 0;
};

const updateDomain = async (name: string, ip: string) => {
  console.log(`updating network mapping for: ${name}`);
  const { id } = await getDomainMap(name, ip);
  const params = {
    type: "A",
    data: ip,
  };
  await networkAPI.patch(`${domainUrl}/${id}`, params);
  console.log(`updated network mapping`);
  return ok;
};

const removeDomain = async (name: string) => {
  console.log(`removing network mapping for: ${name}`);
  const result = await getDomainMap(name);
  if (result?.id) {
    await networkAPI.delete(`${domainUrl}/${result.id}`);
  }
  console.log("removed network mapping");
  return ok;
};

export default {
  checkDomain,
  updateDomain,
  removeDomain,
};
