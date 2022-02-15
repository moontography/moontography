import axios from "axios";

export default {
  client: axios.create({
    // baseURL: process.env.BUYBOT_ENDPOINT || `https://buybot.oklg.io`,
    baseURL: `https://buybot.oklg.io`,
  }),

  async getTelegramChannelId(channel: string) {
    return await this.request("get", `/telegram/${channel}`);
  },

  async request(
    verb: "get" | "post" | "delete",
    url: string,
    params?: any,
    body?: any
  ) {
    try {
      const { data } = await this.client[verb](url, { params, body });
      return data;
    } catch (err: any) {
      if (err.response) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  },
};
