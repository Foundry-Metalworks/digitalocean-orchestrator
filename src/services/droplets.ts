import axios from 'axios';
import mapper from './mapper/droplets';
import { getSnapshotId, takeSnapshot } from "./snapshots";
import { getDomainMapId, updateDomain } from "./network";
import { config } from '../util/axios';

const ok = "ok";
const dropletBaseUrl = "https://api.digitalocean.com/v2/droplets";
const dropletUrl = (id: string) => `https://api.digitalocean.com/v2/droplets/${id}`;
const dropletActionUrl = (id: string) => `https://api.digitalocean.com/v2/droplets/${id}/actions`;

export const getDropletId = async () => {
    const result = await axios.get(dropletBaseUrl, config({ tag_name: 'dnd' }));

    return mapper.fromIdResponse(result.data);
}

const getDropletStatus = async (id: string) => {
    const result = await axios.get(dropletUrl(id), config({}));

    return mapper.fromStatusResponse(result.data);
}

const killDroplet = async (id: string) => {
    await axios.post(dropletActionUrl(id), { type: "power_off" }, config());
    console.log(`killed droplet with id: ${id}`);

    return ok;
}

const waitForStopped = async (id: string) => {
    let count = 0;
    let status = await getDropletStatus(id);
    while (status.status != "off") {
        if (count++ == 120) {
            console.log('waited too long, killing...');
            await killDroplet(id);
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 2500));
            status = await getDropletStatus(id);
        }
    }
};

const snapshotAndDelete = async (dropletId: string) => {
    await takeSnapshot(dropletId);
    console.log("Deleting droplet with id: " + dropletId);
    await axios.delete(dropletUrl(dropletId), config());
    console.log("Deleted droplet with id: " + dropletId);
}

const stopDroplet = async (id: string) => {
    console.log(`stopping droplet with id: ${id}`);
    await axios.post(dropletActionUrl(id), { type: "shutdown" }, config());
    await waitForStopped(id);
    console.log(`stopped droplet with id: ${id}`);

    await snapshotAndDelete(id);

    return ok;
}

const waitForStarted = async (id: string) => {
    const status = await getDropletStatus(id);

    if (status.status != "active") {
        await new Promise(resolve => setTimeout(resolve, 2500));
        await waitForStarted(id);
    }
}

const startDroplet = async () => {
    const snapshotId = await getSnapshotId();

    console.log(`starting droplet from snapshot id: ${snapshotId.id}`);
    const result = await axios.post(dropletBaseUrl,  {
            name: "tenzin-dnd",
            region: "tor1",
            size: "s-2vcpu-2gb-amd",
            image: snapshotId.id,
            tags: ["dnd"]
        },
        config());
    const id = result.data.droplet.id;
    await waitForStarted(id);
    console.log(`started droplet with id: ${id}`);

    console.log(`updating network mapping`)
    const mappingId = await getDomainMapId();
    const ip = await getDropletIP(id);
    await updateDomain(mappingId.id, ip.ip);
    console.log(`updated network mapping`)

    return ok;
}

const getDropletIP = async (id: string) => {
    const result = await axios.get(dropletUrl(id), config());

    return mapper.fromIPResponse(result.data);
}

export default {
    getDropletId,
    getDropletStatus,
    killDroplet,
    stopDroplet,
    startDroplet,
    getDropletIP
};