/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetIdResponse = (data: any): { id: string | undefined } => {
  const snapshots = data.snapshots;
  if (snapshots.length > 0) {
    return { id: snapshots[0].id };
  }
  return { id: undefined };
};

export default {
  fromIdResponse: fromGetIdResponse,
};
