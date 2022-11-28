import axios from "axios";
import mapper from './mapper/snapshots'
import {config} from "../util/axios";

const ok = "ok";
const dropletActionUrl = (id: string) => `https://api.digitalocean.com/v2/droplets/${id}/actions`;
const actionUrl = (id: string) => `https://api.digitalocean.com/v2/actions/${id}`;
const snapshotUrl = (id: string) => `https://api.digitalocean.com/v2/snapshots/${id}`;


export const getSnapshotId = async () => {
    const url = "https://api.digitalocean.com/v2/snapshots";
    const result = await axios.get(url, config({ tag_name: "dnd", resource_type: "droplet" }));

    return mapper.fromIdResponse(result.data);
}

const deleteSnapshot = async (id: string) => {
    console.log("Deleting snapshot with id: " + id);
    await axios.delete(snapshotUrl(id), config());
    console.log("Deleted snapshot");

    return ok;
}


export const takeSnapshot = async (dropletId: string) => {
    const oldSnapshotId = await getSnapshotId();
    const snapshotResult = await axios.post(dropletActionUrl(dropletId), { type: "snapshot" }, config());
    const actionId = snapshotResult.data.action.id;

    console.log("Taking snapshot of droplet with id: " + dropletId);
    let status = await axios.get(actionUrl(actionId), config());
    while (status.data.status != "completed") {
        console.log("Waiting for completion, action status currently: " + status.data.status)
        await new Promise((resolve) => setTimeout(resolve, 2500));
        status = await axios.get(actionUrl(actionId), config());
    }
    console.log("Finished taking snapshot");

    await deleteSnapshot(oldSnapshotId.id);

    return ok;
}


export default {
    takeSnapshot,
    getSnapshotId,
    deleteSnapshot
}