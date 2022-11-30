import axios from 'axios';
import mapper from './mapper/droplets';
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

const deleteDroplet = async (id: string) => {
    console.log("Deleting droplet with id: " + id);
    await axios.delete(dropletUrl(id), config());
    console.log("Deleted droplet with id: " + id);
}

const stopDroplet = async (id: string) => {
    console.log(`stopping droplet with id: ${id}`);
    await axios.post(dropletActionUrl(id), { type: "shutdown" }, config());
    await waitForStopped(id);
    console.log(`stopped droplet with id: ${id}`);

    return ok;
}

const waitForStarted = async (id: string) => {
    const status = await getDropletStatus(id);

    if (status.status != "active") {
        await new Promise(resolve => setTimeout(resolve, 2500));
        await waitForStarted(id);
    }
}

const startDroplet = async (snapshotId: string) => {
    console.log(`starting droplet from snapshot id: ${snapshotId}`);
    const result = await axios.post(dropletBaseUrl,  {
            name: "tenzin-dnd",
            region: "tor1",
            size: "s-2vcpu-2gb",
            image: snapshotId,
            tags: ["dnd"]
        },
        config());
    const id = result.data.droplet.id;
    await waitForStarted(id);
    console.log(`started droplet with id: ${id}`);

    return { id };
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
    deleteDroplet,
    startDroplet,
    getDropletIP
};