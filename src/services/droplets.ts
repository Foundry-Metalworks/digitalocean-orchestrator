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

export default {
    getDropletId,
    getDropletStatus
};