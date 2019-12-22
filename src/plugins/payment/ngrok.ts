import config from 'config';
const axios = require('axios').default;

export default class Ngrok {
  public async GetPublicURL() {
    const { data } = await axios.get(config.get("zalopay.ngrok.tunnels"));
    return data.tunnels[0].public_url;
  }
}
