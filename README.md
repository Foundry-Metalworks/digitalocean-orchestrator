# digitalocean-orchestrator

Backend for the https://github.com/t2pellet/digitalocean-foundry-client

## Deployment

You can deploy it for free on render:
https://render.com/docs/deploy-node-express-app

Put this repo's URL for the 'public git repository field' when creating the web service.

Then use these settings for build/deployment:

<img src="https://user-images.githubusercontent.com/4323034/204407819-3f9c39f4-03e3-41ae-a759-ba6b0a3337de.png" width="600px" />

Under advanced, add a secret file:

<img src="https://user-images.githubusercontent.com/4323034/204408052-97d7b09a-7feb-4f99-87d8-604b80f3973a.png" width="400px" />

! Your DOMAIN_NAME is your apex domain name, not the specific subdomain you want to use for foundry / dnd

## DigitalOcean

On the DigitalOcean side, create a Premium AMD Droplet (2vcpu, 2gb):
![image](https://user-images.githubusercontent.com/4323034/204408615-07a39da6-4c63-4ff2-a4b4-adfc5f7a5d2b.png)

Setup foundry on it as you would any linux installation:
https://foundryvtt.wiki/en/setup/linux-installation (setup caddy with your domain name)

Switch to DigitalOceacn for your Domain's nameservers:
https://docs.digitalocean.com/tutorials/dns-registrars/

You'll also need your token for the deployment part (described above)
