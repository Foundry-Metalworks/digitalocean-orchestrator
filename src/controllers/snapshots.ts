import { tryCatchHelper } from "../util/controller";
import { getDropletId }  from "../services/droplets";
import service from "../services/snapshots";

const onSaveRequest = tryCatchHelper(async () => {
    const dropletId = (await getDropletId()).id;
    return await service.takeSnapshot(dropletId);
});

export default {
    onSaveRequest
}