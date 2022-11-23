import axios from 'axios';
import { config } from '../util/axios';
import mapper from './mapper/network';

const ok = "ok";
const baseDomainUrl = `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records`;
const domainUrl = (id: string) => `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records/${id}`;

const getDomainMapId = async () => {
    const result = await axios.get(baseDomainUrl, config({ type: "A" }));

    return mapper.fromIdResponse(result.data);
}

const updateDomain = async (id: string, ip: string) => {
    const data = {
        type: "A",
        data: ip
    }
    await axios.patch(domainUrl(id), data, config());

    return ok;
}

export default {
    getDomainMapId,
    updateDomain
}