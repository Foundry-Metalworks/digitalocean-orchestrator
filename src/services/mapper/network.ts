/* eslint-disable  @typescript-eslint/no-explicit-any */

const fromGetIdResponse = (data: any) => {
    return { id: data.domain_records[0].id };
}

const fromCreateResponse = (data: any) => {
    return { id: data.domain_record.id };
}

export default {
    fromIdResponse: fromGetIdResponse,
    fromCreateResponse
};