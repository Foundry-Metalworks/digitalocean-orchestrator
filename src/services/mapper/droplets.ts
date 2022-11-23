/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetIdResponse = (data: any) => {
    return { id: data.droplets[0].id };
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetStatusResponse = (data: any) => {
    return { status: data.droplet.status };
}

export default {
    fromIdResponse: fromGetIdResponse,
    fromStatusResponse: fromGetStatusResponse
};