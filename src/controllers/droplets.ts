import dropletService from "../services/droplets";
import snapshotService from "../services/snapshots";
import networkService from "../services/network";
import {tryCatchHelper} from "../util/controller";

const onStatusRequest = tryCatchHelper(async () => {
    let id;
    try {
        id = await dropletService.getDropletId();
    }
    catch (e) {
        return { status: "deleted" };
    }
    return await dropletService.getDropletStatus(id.id);
});

const onStopRequest = tryCatchHelper(async () => {
    const id = await dropletService.getDropletId();
    const result = await dropletService.stopDroplet(id.id);
    await snapshotService.takeSnapshot(id.id);
    await dropletService.deleteDroplet(id.id);
    return result;
});

const onStartRequest = tryCatchHelper(async () => {
    const snapshotId = await snapshotService.getSnapshotId();
    if (snapshotId == null) throw new Error("Null snapshot id");
    const result = await dropletService.startDroplet(snapshotId.id);
    const ip = await dropletService.getDropletIP(result.id);
    await networkService.updateDomain(result.id, ip.ip);
    return result;
});

const onIPRequest = tryCatchHelper(async () => {
    const id = await dropletService.getDropletId();
    return await dropletService.getDropletIP(id.id);
})

export default {
    onStatusRequest,
    onStopRequest,
    onStartRequest,
    onIPRequest
}