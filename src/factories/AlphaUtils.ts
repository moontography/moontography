import axios from "axios";

export default {
  async getLatestAlpha(address: string, perPage = 99) {
    const {
      data: { alpha },
    } = await axios.get(`https://api.oklg.io/alpha/latest`, {
      params: {
        address,
        amount: perPage,
      },
    });
    return alpha;
  },

  async honeypotCheck(network: string, contract: string, slippage = 25) {
    const {
      data: { canBuyAndSell },
    } = await axios.get(
      `https://api.oklg.io/alpha/honeypot/check/${network}/${contract}/${slippage}`
    );
    return canBuyAndSell;
  },

  async isUserAlphaValidated(address: string) {
    const {
      data: { validated },
    } = await axios.get(`https://api.oklg.io/alpha/validated`, {
      params: {
        address,
      },
    });
    return validated;
  },

  async validateSignature({ address, message, signature }: any) {
    const { data } = await axios.post(`https://api.oklg.io/alpha/validate`, {
      address,
      message,
      signature,
    });
    return data;
  },
};
