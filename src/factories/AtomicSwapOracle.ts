import axios from "axios";

export default {
  client: axios.create({
    baseURL: process.env.ATOMIC_SWAP_ENDPOINT || `http://localhost:8000`, // `https://asaas.moontography.com`,
  }),

  async getSwap({ userAddress, sourceNetwork, sourceContract }: any) {
    const { data } = await this.client.get(
      `/swap/get/target/${userAddress}/${sourceNetwork}/${sourceContract}`
    );
    return data;
  },

  async createSwap({
    sourceTimestamp,
    sourceNetwork,
    sourceContract,
    targetTimestamp,
    targetContract,
  }: any) {
    const { data } = await this.client.post(
      `/swap/create/${sourceTimestamp}/${sourceNetwork}/${sourceContract}/${targetTimestamp}/${targetContract}`
    );
    return data;
  },

  async sendTokens({ sourceNetwork, sourceContract, sourceSwapId }: any) {
    const { data } = await this.client.post(
      `/send/${sourceNetwork}/${sourceContract}/${sourceSwapId}`
    );
    return data;
  },
};
