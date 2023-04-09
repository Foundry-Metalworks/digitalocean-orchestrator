import axios, { AxiosInstance } from "axios";
import mapper from "./mapper/droplets";
import { get, post, remove } from "../util/axios";
import dns from "dns";
import * as process from "process";

const dropletBaseUrl = "droplets";
const dropletUrl = (id: string) => `droplets/${id}`;
const dropletActionUrl = (id: string) => `droplets/${id}/actions`;

const getSetupScript = (name: string) => `#!/bin/bash
sudo cd /root/
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install nodejs caddy unzip -y
sudo npm install pm2 -g
mkdir /root/foundry
mkdir -p /root/foundryuserdata
wget --output-document /root/foundry/foundryvtt.zip "${process.env.FOUNDRY_URL}"
unzip /root/foundry/foundryvtt.zip -d /root/foundry/
rm /root/foundry/foundryvtt.zip
read -r -d '' CADDY << END1
${name}.${process.env.DOMAIN_NAME} {
    reverse_proxy localhost:30000
    encode zstd gzip
}
END1
echo "$CADDY" > "/etc/caddy/Caddyfile"
sudo service caddy restart
sudo pm2 startup --hp /root/
sudo pm2 start "node /root/foundry/resources/app/main.js --dataPath=/root/foundryuserdata" --name foundry --hp /root/
sudo pm2 save --hp /root/
read -r -d '' USERDATA << END2
{
  "dataPath": "/root/foundryuserdata",
  "compressStatic": true,
  "fullscreen": false,
  "hostname": "${name}.${process.env.DOMAIN_NAME}",
  "language": "en.core",
  "localHostname": null,
  "port": 30000,
  "protocol": null,
  "proxyPort": 443,
  "proxySSL": true,
  "routePrefix": null,
  "updateChannel": "stable",
  "upnp": true,
  "upnpLeaseDuration": null,
  "awsConfig": null,
  "passwordSalt": null,
  "sslCert": null,
  "sslKey": null,
  "world": null,
  "serviceConfig": null
}
END2
mkdir -p /root/foundryuserdata/Config
echo "$USERDATA" > "/root/foundryuserdata/Config/options.json"
sudo pm2 restart foundry
sudo service caddy restart
`;

export const getDropletId = async (axios: AxiosInstance, name: string) => {
  console.log(`${name}.${process.env.DOMAIN_NAME}`);
  const result = await get(axios, dropletBaseUrl, {
    name: `${name}.${process.env.DOMAIN_NAME}`,
  });

  return mapper.fromIdResponse(result.data);
};

const getDropletStatus = async (axios: AxiosInstance, id: string) => {
  const result = await get(axios, dropletUrl(id));

  return mapper.fromStatusResponse(result.data);
};

const killDroplet = async (axios: AxiosInstance, id: string) => {
  await post(axios, dropletActionUrl(id), { type: "power_off" });
  console.log(`killed droplet with id: ${id}`);
};

const waitForStopped = async (axios: AxiosInstance, id: string) => {
  let count = 0;
  let status = await getDropletStatus(axios, id);
  while (status.status != "off") {
    if (count++ == 60) {
      console.log("waited too long, killing...");
      await killDroplet(axios, id);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      status = await getDropletStatus(axios, id);
    }
  }
};

const deleteDroplet = async (axios: AxiosInstance, id: string) => {
  console.log("Deleting droplet with id: " + id);
  await remove(axios, dropletUrl(id));
  console.log("Deleted droplet with id: " + id);
};

const stopDroplet = async (axios: AxiosInstance, id: string) => {
  console.log(`stopping droplet with id: ${id}`);
  await post(axios, dropletActionUrl(id), { type: "shutdown" });
  await waitForStopped(axios, id);
  console.log(`stopped droplet with id: ${id}`);
};

const waitForStarted = async (axios: AxiosInstance, id: string) => {
  const status = await getDropletStatus(axios, id);

  if (status.status != "active") {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await waitForStarted(axios, id);
  }
};

const startDroplet = async (
  axios: AxiosInstance,
  name: string,
  snapshotId?: string
) => {
  console.log(`starting droplet from snapshot id: ${snapshotId}`);
  const data = {
    name: `${name}.${process.env.DOMAIN_NAME}`,
    region: "tor1",
    size: "s-1vcpu-1gb",
    tags: ["dnd"],
    image: snapshotId || "ubuntu-20-04-x64",
    user_data: snapshotId == null ? getSetupScript(name) : "",
  };
  const result = await post(axios, dropletBaseUrl, data);
  const id = result.data.droplet.id;
  await waitForStarted(axios, id);
  console.log(`started droplet with id: ${id}`);

  return { id };
};

const getFriendlyIP = async (subdomain: string, ip: string) => {
  const url = `https://${subdomain}.${process.env.DOMAIN_NAME}`;
  try {
    const dnsIp = await new Promise((resolve, reject) => {
      dns.lookup(url, { family: 4 }, (err, address) => {
        if (err) reject(err);
        resolve(address);
      });
    });
    if (dnsIp == ip) {
      const reachable = await get(axios, url, { method: "HEAD" });
      if (reachable.status == 302 || reachable.status == 200) {
        return { ip: url };
      }
    }
  } catch (e) {
    console.error(e);
    return { ip: `http://${ip}:30000` };
  }
  return { ip: `http://${ip}:30000` };
};

const getDropletIP = async (axios: AxiosInstance, id: string) => {
  const result = await get(axios, dropletUrl(id));
  return mapper.fromIPResponse(result.data);
};

export default {
  getDropletId,
  getDropletStatus,
  killDroplet,
  stopDroplet,
  deleteDroplet,
  startDroplet,
  getDropletIP,
  getFriendlyIP,
};
