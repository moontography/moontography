import axios from "axios";

export default {
  client: axios.create({
    // baseURL: process.env.ATOMIC_SWAP_ENDPOINT || `https://as.moontography.com`,
    baseURL: `https://as.moontography.com`,
  }),

  async getSwap({ userAddress, sourceNetwork, sourceContract }: any) {
    return await this.request(
      "get",
      `/swap/get/target/${userAddress}/${sourceNetwork}/${sourceContract}`
    );
  },

  async createSwap({
    sourceTimestamp,
    sourceNetwork,
    sourceContract,
    targetTimestamp,
    targetContract,
  }: any) {
    return await this.request(
      "post",
      `/swap/create/${sourceTimestamp}/${sourceNetwork}/${sourceContract}/${targetTimestamp}/${targetContract}`
    );
  },

  async sendTokens({ targetNetwork, targetContract, targetSwapId }: any) {
    return await this.request(
      "post",
      `/send/${targetNetwork}/${targetContract}/${targetSwapId}`
    );
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
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  },
};
