import BigNumber from "bignumber.js";
import MTGYFaaS from "../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../factories/web3/MTGYFaaSToken";
import MTGYFaaSTokenV1 from "../../factories/web3/MTGYFaaSTokenV1";

export default {
  // async faasHarvestTokens({ state }, tokenAddy) {
  //   const userAddy = state.web3.address;
  //   // const faasAddress = getters.activeNetwork.contracts.faas;
  //   const web3 = state.web3.instance;
  //   const contract = MTGYFaaSToken(web3, tokenAddy);
  //   await contract.methods.harvestTokens().send({ from: userAddy });
  // },

  async getFaasUserStakingContracts({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasAddy = getters.activeNetwork.contracts.faas;
    const contract = MTGYFaaS(web3, faasAddy);
    const tokensUserIsTaking = await contract.methods
      .getUserStakingContracts(userAddy)
      .call();
    commit("SET_FAAS_USER_STAKING_CONTRACTS", tokensUserIsTaking);
  },

  async getAllStakingContracts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    // const userAddy = state.web3.address;
    const faasAddy = getters.activeNetwork.contracts.faas;
    const selectedTokenAddress = state.selectedAddressInfo.address;

    let tokenAddresses;
    const contract = MTGYFaaS(web3, faasAddy);
    if (selectedTokenAddress && web3.utils.isAddress(selectedTokenAddress)) {
      tokenAddresses = await contract.methods
        .getTokensForStaking(selectedTokenAddress)
        .call();
    } else {
      tokenAddresses = await contract.methods.getAllFarmingContracts().call();
    }

    const stakingContracts = await Promise.all(
      tokenAddresses.map(async (farmingTokenAddy) => {
        try {
          const farmingCont = MTGYFaaSToken(web3, farmingTokenAddy);
          const [
            tokenAddy,
            rewardAddy,
            lastStakableBlock,
            farmingInfo,
          ] = await Promise.all([
            farmingCont.methods.stakedTokenAddress().call(),
            farmingCont.methods.rewardsTokenAddress().call(),
            farmingCont.methods.getLastStakableBlock().call(),
            dispatch("getErc20TokenInfo", farmingTokenAddy),
          ]);
          const { name, symbol, decimals, userBalance } = await dispatch(
            "getErc20TokenInfo",
            tokenAddy
          );
          const {
            name: rewardName,
            symbol: rewardSymbol,
            decimals: rewardDecimals,
            userBalance: rewardUserBalance,
          } = await dispatch("getErc20TokenInfo", rewardAddy);
          return {
            farmingTokenAddy,
            tokenAddy,
            lastStakableBlock,
            farmingTokenName: farmingInfo.name,
            farmingTokenSymbol: farmingInfo.symbol,
            farmingTokenDecimals: farmingInfo.decimals,
            farmingTokenBalance: farmingInfo.userBalance,
            currentTokenName: name,
            currentTokenSymbol: symbol,
            currentTokenDecimals: decimals,
            currentTokenBalance: userBalance,
            rewardAddy,
            rewardTokenName: rewardName,
            rewardTokenSymbol: rewardSymbol,
            rewardTokenDecimals: rewardDecimals,
            rewardTokenBalance: rewardUserBalance,
          };
        } catch (err) {
          console.error(`error getting farming contract`, err);
          return null;
        }
      })
    );
    commit(
      "SETT_FAAS_STAKING_CONTRACTS",
      stakingContracts.filter((c) => !!c)
    );
  },

  async getFaasStakingInfo({ dispatch, state }, farmingAddy) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingAddy);
    const [
      userStakingAmount,
      stakingContract,
      rewardsContract,
      poolInfo,
      lastBlock,
      currentBlock,
    ] = await Promise.all([
      faasToken.methods.balanceOf(userAddy).call(),
      faasToken.methods.stakedTokenAddress().call(),
      faasToken.methods.rewardsTokenAddress().call(),
      faasToken.methods.pool().call(),
      faasToken.methods.getLastStakableBlock().call(),
      web3.eth.getBlockNumber(),
    ]);
    const tokensRewardedPerBlock = poolInfo.perBlockNum;
    const [stakingTokenInfo, rewardsTokenInfo] = await Promise.all([
      dispatch("getErc20TokenInfo", stakingContract),
      dispatch("getErc20TokenInfo", rewardsContract),
    ]);
    return {
      userStakingAmount,
      tokensRewardedPerBlock,
      currentBlock,
      lastBlock,
      stakingTokenInfo,
      rewardsTokenInfo,
    };
  },

  async getFaasStakingInfoV1({ dispatch, state }, farmingAddy) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSTokenV1(web3, farmingAddy);
    const [
      userStakingAmount,
      stakingContract,
      rewardsContract,
      tokensRewardedPerBlock,
      lastBlock,
      currentBlock,
    ] = await Promise.all([
      faasToken.methods.balanceOf(userAddy).call(),
      faasToken.methods.stakedTokenAddress().call(),
      faasToken.methods.rewardsTokenAddress().call(),
      faasToken.methods.perBlockNum().call(),
      faasToken.methods.getLastStakableBlock().call(),
      web3.eth.getBlockNumber(),
    ]);
    const [stakingTokenInfo, rewardsTokenInfo] = await Promise.all([
      dispatch("getErc20TokenInfo", stakingContract),
      dispatch("getErc20TokenInfo", rewardsContract),
    ]);
    return {
      userStakingAmount,
      tokensRewardedPerBlock,
      currentBlock,
      lastBlock,
      stakingTokenInfo,
      rewardsTokenInfo,
    };
  },

  async faasStakeTokens(
    { dispatch, state },
    { farmingContractAddress, stakingContractAddress, amountTokens }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    await dispatch("genericTokenApproval", {
      spendAmount: amountTokens,
      tokenAddress: stakingContractAddress,
      delegateAddress: farmingContractAddress,
    });
    await faasToken.methods.stakeTokens(amountTokens).send({ from: userAddy });
  },

  async faasUnstakeTokens(
    { state },
    { farmingContractAddress, amountTokens, harvestTokens }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    if (!amountTokens) {
      amountTokens = await faasToken.methods.balanceOf(userAddy).call();
    }
    await faasToken.methods
      .unstakeTokens(
        amountTokens,
        typeof harvestTokens === "boolean" ? harvestTokens : true
      )
      .send({ from: userAddy });
  },

  async getFaasPoolCreationCost({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const addy = getters.activeNetwork.contracts.faas;
    const faasCont = MTGYFaaS(web3, addy);
    const cost = await faasCont.methods.mtgyServiceCost().call();
    commit(
      "SET_FAAS_POOL_CREATION_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async faasCreateNewPool(
    { dispatch, getters, state },
    { stakableToken, rewardsToken, rewardsSupply, perBlockNum, timelockSeconds }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasAddy = getters.activeNetwork.contracts.faas;
    const faasToken = MTGYFaaS(web3, faasAddy);
    await dispatch("genericTokenApproval", {
      spendAmount: await faasToken.methods.mtgyServiceCost().call(),
      tokenAddress: stakableToken,
      delegateAddress: faasAddy,
    });
    await dispatch("genericTokenApproval", {
      spendAmount: rewardsSupply,
      tokenAddress: rewardsToken,
      delegateAddress: faasAddy,
    });
    await faasToken.methods
      .createNewTokenContract(
        rewardsToken,
        stakableToken,
        rewardsSupply,
        perBlockNum,
        0,
        timelockSeconds
      )
      .send({ from: userAddy });
  },
};
