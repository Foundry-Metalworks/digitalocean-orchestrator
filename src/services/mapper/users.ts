/* eslint-disable  @typescript-eslint/no-explicit-any */

const fromGetUserResponse = (data: any[]) => {
  return {
    server: data.length > 0 ? data[0].server : null,
  };
};

export default {
  fromGetResponse: fromGetUserResponse,
};
