import axios from 'axios';
import mapper from './mapper/droplets';
import { config } from '../util/axios';

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

    console.log('starting droplet with id: ' + id);
    await waitForStarted(id);
    console.log('started droplet with id: ' + id);

    return;
}

export default {
    getDropletId,
    getDropletStatus,
    startDroplet
};