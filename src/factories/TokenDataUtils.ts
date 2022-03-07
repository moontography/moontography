import axios from "axios";

export default {
  async getTokenInfo(tokenId: string) {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}`
    );
    return data;
  },

  async getTokenPriceUSD(network: string, symbol: string, token: string) {
    const {
      data: { price },
    } = await axios.get(`https://api.oklg.io/token/price`, {
      params: {
        network,
        symbol,
        token,
      },
    });
    return price;
  },

  async getTokenChart(
    tokenId: string,
    days: number = 14,
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

  async getTotalSupply() {
    try {
      const { data: totalSupply } = await axios.get(
        `https://api.oklg.io/total`,
        {
          responseType: "text",
        }
      );
      return totalSupply;
    } catch (err) {
      console.error(`Error getting circulating supply`, err);
      return "0";
    }
  },

  async getCirculatingSupply() {
    try {
      const { data: circulatingSupply } = await axios.get(
        `https://api.oklg.io/circulating`,
        {
          responseType: "text",
        }
      );
      return circulatingSupply;
    } catch (err) {
      console.error(`Error getting circulating supply`, err);
      return "0";
    }
  },
};
