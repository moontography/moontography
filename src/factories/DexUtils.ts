import axios from "axios";
import BigNumber from "bignumber.js";

export default {
  async getTokenPrice(
    tokenAddy: string,
    usdBuyToken = "BUSD",
    network = "bsc"
  ) {
    const {
      data: { price },
    } = await axios.get(`https://${network}.api.0x.org/swap/v1/quote`, {
      params: {
        buyToken: usdBuyToken,
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
