/* eslint-disable  @typescript-eslint/no-explicit-any */

const fromGetIdResponse = (data: any) => {
  if (data.domain_records.length) {
    return { id: data.domain_records[0].id };
  }
  return { id: null };
};

const fromCreateResponse = (data: any) => {
  return { id: data.domain_record.id };
};

export default {
  fromIdResponse: fromGetIdResponse,
  fromCreateResponse,
};
