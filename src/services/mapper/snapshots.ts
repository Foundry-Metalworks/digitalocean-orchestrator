/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetIdResponse = (data: any) => {
    const snapshots = data.snapshots;
    if (snapshots.length > 0) {
        return { id : snapshots[0].id };
    }
    return null;
}

export default {
    fromIdResponse: fromGetIdResponse
};