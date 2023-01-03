import axios from "axios";

let token = "";
let expiryTime = Date.now();

const updateAuth0Token = async () => {
  const result = await axios.post(
    "https://dev-16sshopsxbcm1ede.us.auth0.com/oauth/token",
    {
      grant_type: "client_credentials",
      client_id: "9AYkqOk9eNMjB6mcfvJ85g6rqvRsBQFP",
      client_secret: "{yourClientSecret}",
      audience: "https://dev-16sshopsxbcm1ede.us.auth0.com/api/v2/",
    },
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    }
  );

  token = result.data.access_token;
  expiryTime = Date.now() + 86400000;
};

export const getAuth0Token = async () => {
  if (!token || Date.now() >= expiryTime) {
    await updateAuth0Token();
  }
  return token;
};
