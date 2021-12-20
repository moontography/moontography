import axios from "axios";

export default {
  client: axios.create({
    // baseURL: process.env.ATOMIC_SWAP_ENDPOINT || `https://as.oklg.io`,
    baseURL: `https://as.oklg.io`,
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

  async sendTokens({
    checkOnly,
    targetNetwork,
    targetContract,
    targetSwapId,
  }: any) {
    return await this.request(
      "post",
      `/send/${targetNetwork}/${targetContract}/${targetSwapId}?checkOnly=${
        checkOnly || ""
      }`
    );
  },

  async refundTokens({
    checkOnly,
    targetNetwork,
    targetContract,
    targetSwapId,
  }: any) {
    return await this.request(
      "post",
      `/refund/${targetNetwork}/${targetContract}/${targetSwapId}?checkOnly=${
        checkOnly || ""
      }`
    );
  },

  async getLastUserSwap(
    network: string,
    userAddress: string,
    instContractAddress: string
  ) {
    return await this.request(
      "get",
      `/user/last/swap/${network}/${userAddress}/${instContractAddress}`
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
