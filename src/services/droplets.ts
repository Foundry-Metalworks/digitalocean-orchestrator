import axios from 'axios';
import mapper from './mapper/droplets';
import { config } from '../util/axios';

const getDropletId = async () => {
    const url = "https://api.digitalocean.com/v2/droplets";
    const result = await axios.get(url, config({ tag_name: 'dnd' }));

    return mapper.fromIdResponse(result.data);
}

export default {
    getDropletId
};