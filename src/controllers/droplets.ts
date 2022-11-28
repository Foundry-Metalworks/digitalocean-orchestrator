import service from "../services/droplets";
import {tryCatchHelper} from "../util/controller";

const onStatusRequest = tryCatchHelper(async () => {
    let id;
    try {
        id = await service.getDropletId();
    }
    catch (e) {
        return { status: "deleted" };
    }
    return await service.getDropletStatus(id.id);
});

const onStopRequest = tryCatchHelper(async () => {
    const id = await service.getDropletId();
    return await service.stopDroplet(id.id);
});

const onStartRequest = tryCatchHelper(async () => {
    return await service.startDroplet();
});

const onIPRequest = tryCatchHelper(async () => {
    const id = await service.getDropletId();
    return await service.getDropletIP(id.id);
})

export default {
    onStatusRequest,
    onStopRequest,
    onStartRequest,
    onIPRequest
}