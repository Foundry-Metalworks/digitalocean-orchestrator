/* eslint-disable  @typescript-eslint/no-explicit-any */

const fromCheckServerResponse = (data: any[]): boolean => {
  return data[0].exists;
};

export default {
  fromCheckServerResponse,
};
