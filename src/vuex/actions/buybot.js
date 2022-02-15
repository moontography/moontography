import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import OKLGBuybot from "@/factories/web3/OKLGBuybot";
import BuybotFactory from "@/factories/Buybot";

export default {
  async buybotInit({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const productContract = getters.activeNetwork.contracts.buybot;
    const contract = OKLGBuybot(web3, productContract);

    const [dailyCostUSD, allBuybotIds] = await Promise.all([
      contract.methods.paidPricePerDayUsd().call(),
      contract.methods.getAllBuybotIds().call(),
    ]);
    const allBotConfigs = await Promise.all(
      allBuybotIds.map(async (botId) => {
        try {
          const botConf = await contract.methods.buybotConfigs(botId).call();
          const [tokenInfo, channelInfo] = await Promise.all([
            dispatch("getErc20TokenInfo", botConf.token),
            BuybotFactory.getTelegramChannelId(botConf.channel),
          ]);
          return {
            ...botConf,
            tokenInfo,
            channelInfo,
          };
        } catch (err) {
          return false;
        }
      })
    );
    commit("SET_BUYBOT_DAILY_COST", dailyCostUSD);
    commit("SET_BUYBOT_BOTS", allBotConfigs);
  },

  async setupBuybot(
    { dispatch, getters, state },
    { token, client, channel, isPaid, minThresholdUsd, referrer, expiration }
  ) {
    const web3 = state.web3.instance;
    const productContract = getters.activeNetwork.contracts.buybot;
    const userAddy = state.web3.address;
    const contract = OKLGBuybot(web3, productContract);

    // calculate value to send based on desired expiration
    let txnValue = "0";
    if (isPaid) {
      const perDayBaseUSD = state.buybot.dailyCost;
      const [
        overridePricePerDay,
        isCostRemoved,
        ethPriceUSD18,
      ] = await Promise.all([
        contract.methods.overridePricePerDayUSD(userAddy).call(),
        contract.methods.removeCost(userAddy).call(),
        contract.methods.getLatestETHPrice().call(),
      ]);

      if (!isCostRemoved) {
        const finalCostPerDayUSD = new BigNumber(overridePricePerDay).gt(0)
          ? overridePricePerDay
          : perDayBaseUSD;
        const secondsOfService = new BigNumber(
          dayjs(expiration).diff(dayjs(), "seconds")
        );
        txnValue = new BigNumber(finalCostPerDayUSD)
          .times(new BigNumber(10).pow(18))
          .div(ethPriceUSD18)
          .times(secondsOfService)
          .div(60)
          .div(60)
          .div(24)
          .times(new BigNumber(10).pow(18))
          .toFixed(0);
      }
    }

    client = client || "telegram";
    referrer = referrer || "0x0000000000000000000000000000000000000000";
    await contract.methods
      .setupBot(token, client, channel, isPaid, minThresholdUsd, referrer)
      .send({ from: userAddy, value: txnValue });
    await dispatch("buybotInit");
  },
};
