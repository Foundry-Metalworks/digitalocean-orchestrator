import axios from 'axios';
import { config } from '../util/axios';
import mapper from './mapper/network';

const ok = "ok";
const baseDomainUrl = () => `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records`;
const domainUrl = (id: string) => `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records/${id}`;

const getDomainMapId = async () => {
    const result = await axios.get(baseDomainUrl(), config({ type: "A" }));

    return mapper.fromIdResponse(result.data);
}

const updateDomain = async (id: string) => {
    console.log(`updating network mapping for droplet with id: ${id}`);
    const domainId = await getDomainMapId();
    const data = {
        type: "A",
        data: domainId.id
    }
    await axios.patch(domainUrl(id), data, config());
    console.log(`updated network mapping`);

    return ok;
}

export default {
    getDomainMapId,
    updateDomain
}