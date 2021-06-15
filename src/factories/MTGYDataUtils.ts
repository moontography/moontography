import axios from "axios";

export default {
  async getTokenInfo(tokenId: string) {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}`
    );
    return data;
  },

  async getTokenChart(
    tokenId: string,
    days: number = 7,
    interval: string = "daily"
  ) {
    const {
      data: { prices },
    } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days,
          interval,
        },
      }
    );
    return prices;
  },

  async getCirculatingSupply() {
    const { data: circulatingSupply } = await axios.get(
      `https://api.moontography.com/circulating`,
      {
        responseType: "text",
      }
    );
    return circulatingSupply;
  },
};
