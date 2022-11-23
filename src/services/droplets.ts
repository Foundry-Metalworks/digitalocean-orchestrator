import axios from 'axios';
import mapper from './mapper/droplets';
import { config } from '../util/axios';

const ok = "ok";

const getDropletId = async () => {
    const url = "https://api.digitalocean.com/v2/droplets";
    const result = await axios.get(url, config({ tag_name: 'dnd' }));

    return mapper.fromIdResponse(result.data);
}

const getDropletStatus = async (id: string) => {
    const url = `https://api.digitalocean.com/v2/droplets/${id}`;
    const result = await axios.get(url, config({}));

    return mapper.fromStatusResponse(result.data);
}

const killDroplet = async (id: string) => {
    const url = `https://api.digitalocean.com/v2/droplets/${id}/actions`;
    await axios.post(url, { type: "power_off" }, config());
    console.log(`killed droplet with id: ${id}`);

    return ok;
}

const waitForStopped = async (id: string) => {
    let count = 0;
    let status = await getDropletStatus(id);
    while (status.status != "off") {
        if (count++ == 25) {
            console.log('waited too long, killing...');
            await killDroplet(id);
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 2500));
            status = await getDropletStatus(id);
        }
    }
};

const stopDroplet = async (id: string) => {
    const url = `https://api.digitalocean.com/v2/droplets/${id}/actions`;
    await axios.post(url, { type: "shutdown" }, config());

    console.log(`stopping droplet with id: ${id}`);
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

const startDroplet = async (id: string) => {
    const url = `https://api.digitalocean.com/v2/droplets/${id}/actions`;
    await axios.post(url,  { type: "power_on" }, config());

    console.log(`starting droplet with id: ${id}`);
    await waitForStarted(id);
    console.log(`started droplet with id: ${id}`);

    return ok;
}

export default {
    getDropletId,
    getDropletStatus,
    killDroplet,
    stopDroplet,
    startDroplet
};