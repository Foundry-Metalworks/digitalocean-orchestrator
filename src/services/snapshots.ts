import axios from "axios";
import mapper from './mapper/snapshots'
import {config} from "../util/axios";

const ok = "ok";
const dropletActionUrl = (id: string) => `https://api.digitalocean.com/v2/droplets/${id}/actions`;
const actionUrl = (id: string) => `https://api.digitalocean.com/v2/actions/${id}`;
const snapshotUrl = (id: string) => `https://api.digitalocean.com/v2/snapshots/${id}`;


const getSnapshotId = async () => {
    const url = "https://api.digitalocean.com/v2/snapshots";
    const result = await axios.get(url, config({ name: `foundry.${process.env.DOMAIN_NAME}`, resource_type: "droplet" }));

    return mapper.fromIdResponse(result.data);
}

const deleteSnapshot = async (id: string) => {
    console.log("Deleting snapshot with id: " + id);
    await axios.delete(snapshotUrl(id), config());
    console.log("Deleted snapshot");

    return ok;
}

const takeSnapshot = async (dropletId: string) => {
    const oldSnapshotId = await getSnapshotId();
    const snapshotResult = await axios.post(dropletActionUrl(dropletId), { type: "snapshot", name: `foundry.${process.env.DOMAIN_NAME}` }, config());
    const actionId = snapshotResult.data.action.id;

    if (oldSnapshotId != null) {
        await deleteSnapshot(oldSnapshotId.id);
    }

    console.log("Taking snapshot of droplet with id: " + dropletId);
    let status = (await axios.get(actionUrl(actionId), config())).data.action.status;
    while (status != "completed") {
        console.log("Waiting for completion, action status currently: " + status);
        if (status == "errored") {
            throw Error("Failed to take snapshot of droplet with id: " + dropletId);
        }
        await new Promise((resolve) => setTimeout(resolve, 2500));
        status = (await axios.get(actionUrl(actionId), config())).data.action.status;
    }
    console.log("Took snapshot");


    return ok;
}


export default {
    takeSnapshot,
    getSnapshotId,
    deleteSnapshot
}