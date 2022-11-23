/* eslint-disable  @typescript-eslint/no-explicit-any */
const fromGetIdResponse = (data: any) => {
    return { id: data.domain_records[0].id };
}

export default {
    fromIdResponse: fromGetIdResponse
};