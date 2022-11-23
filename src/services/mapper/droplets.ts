/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetIdResponse = (data: any) => {
    return { id: data.droplets[0].id };
}

export default {
    fromIdResponse: fromGetIdResponse
};