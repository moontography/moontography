import BigNumber from "bignumber.js";
import dayjs from "dayjs";
// import sleep from "../../factories/Sleep";
import ERC20 from "@/factories/web3/ERC20";
import OKLGRaffler from "../../factories/web3/OKLGRaffler";

export default {
  async initRaffler({ dispatch }) {
    await Promise.all([dispatch("rafflerCosts"), dispatch("getAllRaffles")]);
  },

  async rafflerCosts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const productContract = getters.activeNetwork.contracts.raffler;
    const productID = state.productIds.raffler;
    const contract = OKLGRaffler(web3, productContract);
    const [cost, entryFeePercentageCharge] = await Promise.all([
      dispatch("getProductCost", {
        productID,
        productContract,
      }),
      contract.methods.entryFeePercentageCharge().call(),
    ]);
    commit("SET_RAFFLER_COSTS", {
      serviceCost: new BigNumber(cost)
        .div(new BigNumber(10).pow(18))
        .toString(),
      entryFeePercentageCharge,
    });
  },

  async getAllRaffles({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = OKLGRaffler(web3, rafflerAddy);
    const raffleIds = await contract.methods.getAllRaffles().call();
    commit("SET_ALL_RAFFLE_IDS", raffleIds);
  },

  async getRaffle({ commit, dispatch, getters, state }, raffleId) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = OKLGRaffler(web3, rafflerAddy);
    const raffleInfo = await contract.methods.raffles(raffleId).call();
    const [
      rewardTokenInfo,
      entryTokenInfo,
      userEntries,
      entries,
    ] = await Promise.all([
      dispatch(
        raffleInfo.isNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
        raffleInfo.rewardToken
      ),
      (async function () {
        if (
          new BigNumber(raffleInfo.entryFee).gt(0) &&
          new BigNumber(raffleInfo.entryToken.toLowerCase()).gt(0)
        ) {
          return await dispatch("getErc20TokenInfo", raffleInfo.entryToken);
        }
      })(),
      contract.methods.entriesIndexed(raffleId, userAddy).call(),
      contract.methods.getRaffleEntries(raffleId).call(),
    ]);
    commit("SET_RAFFLE_INFO", {
      id: raffleId,
      info: {
        ...raffleInfo,
        entries,
        entryTokenInfo,
        rewardTokenInfo,
        userEntries,
      },
    });
  },

  async enterRaffle(
    { dispatch, getters, state },
    { id: raffleId, numEntries }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const raffleInfo = state.raffler.raffleInfo[raffleId];
    const contract = OKLGRaffler(web3, rafflerAddy);
    if (
      new BigNumber(raffleInfo.entryFee).gt(0) &&
      new BigNumber(raffleInfo.entryToken.toLowerCase()).gt(0)
    ) {
      const entryCont = ERC20(web3, raffleInfo.entryToken);
      const entryBalance = await entryCont.methods.balanceOf(userAddy).call();
      if (new BigNumber(entryBalance).lt(raffleInfo.entryFee)) {
        throw new Error(
          `You do not have enough ${raffleInfo.entryTokenInfo.symbol} to enter this raffle.`
        );
      } else {
        await dispatch("genericErc20Approval", {
          spendAmount: raffleInfo.entryFee,
          tokenAddress: raffleInfo.entryToken,
          delegateAddress: rafflerAddy,
        });
      }
    }

    if (
      raffleInfo.userEntries &&
      new BigNumber(raffleInfo.maxEntriesPerAddress).gt(0) &&
      new BigNumber(raffleInfo.userEntries).gte(raffleInfo.maxEntriesPerAddress)
    ) {
      throw new Error(
        `You have entered this raffle the maximum number of times you are allowed.`
      );
    }

    await contract.methods
      .enterRaffle(raffleId, numEntries)
      .send({ from: userAddy });
  },

  async closeRaffleAndRefund({ getters, state }, raffleId) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = OKLGRaffler(web3, rafflerAddy);
    await contract.methods
      .closeRaffleAndRefund(raffleId)
      .send({ from: userAddy });
  },

  async drawRaffleWinner({ getters, state }, raffleId) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = OKLGRaffler(web3, rafflerAddy);
    await contract.methods.drawWinner(raffleId).send({ from: userAddy });
  },

  async createRaffle(
    { dispatch, getters, state },
    {
      entryTokenAddress,
      entryFee,
      isNft,
      rewardTokenAddress,
      rewardAmountOrTokenId,
      start,
      end,
      maxEntriesPerWallet,
    }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const productContract = getters.activeNetwork.contracts.raffler;
    const productID = state.productIds.raffler;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const contract = OKLGRaffler(web3, productContract);
    const rewardCont = ERC20(web3, rewardTokenAddress);
    const [
      nativeBalance,
      serviceCost,
      userRewardBalance,
      rewardTokenInfo,
      entryTokenInfo,
    ] = await Promise.all([
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCost", {
        productID,
        productContract,
      }),
      rewardCont.methods.balanceOf(userAddy).call(),
      dispatch(
        isNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
        rewardTokenAddress
      ),
      (async function () {
        if (entryTokenAddress) {
          return await dispatch("getErc20TokenInfo", entryTokenAddress);
        }
      })(),
    ]);

    if (new BigNumber(nativeBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }

    if (!web3.utils.isAddress(rewardTokenAddress)) {
      throw new Error(
        `Please make sure the reward token is a valid token contract.`
      );
    }

    if (!entryTokenAddress) {
      entryTokenAddress = state.zeroAddy;
    } else if (!web3.utils.isAddress(entryTokenAddress)) {
      throw new Error(
        `Please make sure the entry token is a valid token contract.`
      );
    }

    await dispatch(isNft ? "genericErc721Approval" : "genericErc20Approval", {
      spendAmount: userRewardBalance,
      tokenAddress: rewardTokenAddress,
      delegateAddress: productContract,
    });

    start = start instanceof Date ? dayjs(start).unix() : 0;
    end = end instanceof Date ? dayjs(end).unix() : 0;

    rewardAmountOrTokenId = isNft
      ? rewardAmountOrTokenId
      : new BigNumber(rewardAmountOrTokenId)
          .times(new BigNumber(10).pow(rewardTokenInfo.decimals))
          .toFixed(0);
    entryFee = !entryFee
      ? 0
      : new BigNumber(entryFee)
          .times(new BigNumber(10).pow(entryTokenInfo.decimals))
          .toFixed(0);

    await contract.methods
      .createRaffle(
        rewardTokenAddress,
        rewardAmountOrTokenId,
        isNft,
        start,
        end,
        entryTokenAddress,
        entryFee,
        maxEntriesPerWallet
      )
      .send({ from: userAddy, value: serviceCost });
  },
};
