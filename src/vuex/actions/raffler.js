import BigNumber from "bignumber.js";
import dayjs from "dayjs";
// import sleep from "../../factories/Sleep";
import MTGY from "../../factories/web3/MTGY";
import ERC20 from "@/factories/web3/ERC20";
import MTGYRaffler from "../../factories/web3/MTGYRaffler";

export default {
  async initRaffler({ dispatch }) {
    await Promise.all([dispatch("rafflerCosts"), dispatch("getAllRaffles")]);
  },

  async rafflerCosts({ commit, getters, state }) {
    const web3 = state.web3.instance;
    // const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = MTGYRaffler(web3, rafflerAddy);
    const [mtgyServiceCost, entryFeePercentageCharge] = await Promise.all([
      contract.methods.mtgyServiceCost().call(),
      contract.methods.entryFeePercentageCharge().call(),
    ]);
    commit("SET_RAFFLER_COSTS", { mtgyServiceCost, entryFeePercentageCharge });
  },

  async getAllRaffles({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = MTGYRaffler(web3, rafflerAddy);
    const raffleIds = await contract.methods.getAllRaffles().call();
    commit("SET_ALL_RAFFLE_IDS", raffleIds);
  },

  async getRaffle({ commit, dispatch, getters, state }, raffleId) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = MTGYRaffler(web3, rafflerAddy);
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
    const contract = MTGYRaffler(web3, rafflerAddy);
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

  async drawRaffleWinner({ getters, state }, raffleId) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const contract = MTGYRaffler(web3, rafflerAddy);
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
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const rafflerAddy = getters.activeNetwork.contracts.raffler;
    const mtgyCont = MTGY(web3, mtgyAddy);
    const contract = MTGYRaffler(web3, rafflerAddy);
    const rewardCont = ERC20(web3, rewardTokenAddress);
    const [
      mtgyServiceCost,
      userMtgyBalance,
      userRewardBalance,
      rewardTokenInfo,
      entryTokenInfo,
    ] = await Promise.all([
      contract.methods.mtgyServiceCost().call(),
      mtgyCont.methods.balanceOf(userAddy).call(),
      rewardCont.methods.balanceOf(userAddy).call(),
      dispatch("getErc20TokenInfo", rewardTokenAddress),
      dispatch("getErc20TokenInfo", entryTokenAddress),
    ]);

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

    if (new BigNumber(mtgyServiceCost).gt(userMtgyBalance)) {
      throw new Error(`You do not have enough MTGY to pay the service charge.`);
    }
    await dispatch("genericErc20Approval", {
      spendAmount: mtgyServiceCost,
      tokenAddress: mtgyAddy,
      delegateAddress: rafflerAddy,
    });

    await dispatch(isNft ? "genericErc721Approval" : "genericErc20Approval", {
      spendAmount: userRewardBalance,
      tokenAddress: rewardTokenAddress,
      delegateAddress: rafflerAddy,
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
      .send({ from: userAddy });
  },
};
