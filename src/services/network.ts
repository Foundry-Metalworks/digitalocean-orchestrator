import axios from 'axios';
import { config } from '../util/axios';
import mapper from './mapper/network';

const ok = "ok";
const baseDomainUrl = () => `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records`;
const domainUrl = (id: string) => `https://api.digitalocean.com/v2/domains/${process.env.DOMAIN_NAME}/records/${id}`;

const getOrCreateDomainMap = async (ip: string) => {
    let result = await axios.get(baseDomainUrl(), config({ type: "A", name: `foundry.${process.env.DOMAIN_NAME}` }));
    if (result.data.domain_records.count < 1) {
        result = await axios.post(baseDomainUrl(), {
            type: "A",
            name: "foundry",
            data: ip
        });
    }

    return mapper.fromIdResponse(result.data);
}

const updateDomain = async (id: string, ip: string) => {
    console.log(`updating network mapping for droplet with id: ${id}`);
    const domainId = await getOrCreateDomainMap(ip);
    const data = {
        type: "A",
        data: ip
    }
    await axios.patch(domainUrl(domainId.id), data, config());
    console.log(`updated network mapping`);

    return ok;
}

export default {
    updateDomain
}