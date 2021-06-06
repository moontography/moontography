import axios from "axios";
import BigNumber from "bignumber.js";

export default {
  async getTokenPrice(tokenAddy: string) {
    const {
      data: { price },
    } = await axios.get(`https://bsc.api.0x.org/swap/v1/quote`, {
      params: {
        buyToken: "BUSD",
        sellToken: tokenAddy,
        sellAmount: new BigNumber(10).pow(18).toString(),
        excludedSources:
          "BakerySwap,Belt,DODO,DODO_V2,Ellipsis,Mooniswap,MultiHop,Nerve,SushiSwap,Smoothy,ApeSwap,CafeSwap,CheeseSwap,JulSwap,LiquidityProvider",
        slippagePercentage: 0,
        gasPrice: 0,
      },
    });
    return price;
  },
};
