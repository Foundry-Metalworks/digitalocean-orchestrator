/* eslint-disable  @typescript-eslint/no-explicit-any */

const fromGetIdResponse = (data: any) => {
  if (data.droplets.length) {
    return { id: data.droplets[0].id };
  }
  return { id: undefined };
};

const fromGetStatusResponse = (data: any) => {
  return { status: data.droplet.status };
};

const fromGetIPResponse = (data: any) => {
  return { ip: data.droplet.networks.v4[0].ip_address };
};

export default {
  fromIdResponse: fromGetIdResponse,
  fromStatusResponse: fromGetStatusResponse,
  fromIPResponse: fromGetIPResponse,
};
