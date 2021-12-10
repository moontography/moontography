import BigNumber from "bignumber.js";
import OKLG from "../../factories/web3/OKLG";
import MTGYFaaS from "../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../factories/web3/MTGYFaaSToken";
import MTGYFaaSToken_V3 from "../../factories/web3/MTGYFaaSToken_V3";

export default {
  async getFaasPoolCreationCost({ commit, dispatch, getters, state }) {
    const productContract = getters.activeNetwork.contracts.faas;
    const productID = state.productIds.faas;
    const cost = await dispatch("getProductCost", {
      productID,
      productContract,
    });
    commit(
      "SET_FAAS_POOL_CREATION_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async getAllStakingContracts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
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
            poolInfo,
            contractIsRemoved,
            stakerInfo,
            farmingInfo,
          ] = await Promise.all([
            farmingCont.methods.stakedTokenAddress().call(),
            farmingCont.methods.rewardsTokenAddress().call(),
            farmingCont.methods.getLastStakableBlock().call(),
            farmingCont.methods.pool().call(),
            farmingCont.methods.contractIsRemoved().call(),
            farmingCont.methods.stakers(userAddy).call(),
            dispatch("getErc20TokenInfo", farmingTokenAddy),
          ]);
          const [
            { name, symbol, decimals, userBalance },
            {
              name: rewardName,
              symbol: rewardSymbol,
              decimals: rewardDecimals,
              userBalance: rewardUserBalance,
            },
          ] = await Promise.all([
            dispatch(
              poolInfo.isStakedNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
              tokenAddy
            ),
            dispatch("getErc20TokenInfo", rewardAddy),
          ]);
          return {
            farmingTokenAddy,
            tokenAddy,
            lastStakableBlock,
            poolInfo,
            stakerInfo,
            contractIsRemoved,
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
      contractIsRemoved,
      stakerInfo,
      lastBlock,
      currentBlock,
    ] = await Promise.all([
      faasToken.methods.balanceOf(userAddy).call(),
      faasToken.methods.stakedTokenAddress().call(),
      faasToken.methods.rewardsTokenAddress().call(),
      faasToken.methods.pool().call(),
      faasToken.methods.contractIsRemoved().call(),
      faasToken.methods.stakers(userAddy).call(),
      faasToken.methods.getLastStakableBlock().call(),
      web3.eth.getBlockNumber(),
    ]);
    const tokensRewardedPerBlock = poolInfo.perBlockNum;
    const [stakingTokenInfo, rewardsTokenInfo] = await Promise.all([
      dispatch(
        poolInfo.isStakedNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
        stakingContract
      ),
      dispatch("getErc20TokenInfo", rewardsContract),
    ]);
    return {
      userStakingAmount,
      tokensRewardedPerBlock,
      poolInfo,
      contractIsRemoved,
      stakerInfo,
      currentBlock,
      lastBlock,
      stakingTokenInfo,
      rewardsTokenInfo,
    };
  },

  async faasStakeTokens(
    { dispatch, state },
    {
      farmingContractAddress,
      stakingContractAddress,
      amountTokens,
      nftTokenIds,
    }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    await dispatch(
      nftTokenIds && nftTokenIds.length > 0
        ? "genericErc721Approval"
        : "genericErc20Approval",
      {
        spendAmount: amountTokens,
        tokenAddress: stakingContractAddress,
        delegateAddress: farmingContractAddress,
      }
    );
    await faasToken.methods
      .stakeTokens(
        amountTokens,
        nftTokenIds && nftTokenIds.length > 0 ? nftTokenIds : []
      )
      .send({ from: userAddy });
  },

  async faasStakeTokens_V3(
    { dispatch, state },
    { farmingContractAddress, stakingContractAddress, amountTokens }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken_V3(web3, farmingContractAddress);
    await dispatch("genericErc20Approval", {
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

  async faasEmergencyUnstake({ state }, { farmingContractAddress }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    await faasToken.methods.emergencyUnstake().send({ from: userAddy });
  },

  async faasHarvestTokens({ state }, { farmingContractAddress }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    await faasToken.methods.harvestForUser(userAddy).send({ from: userAddy });
  },

  async faasCreateNewPool(
    { dispatch, getters, state },
    {
      stakableToken,
      rewardsToken,
      rewardsSupply,
      perBlockNum,
      timelockSeconds,
      isStakedTokenNft,
    }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const productContract = getters.activeNetwork.contracts.faas;
    const productID = state.productIds.faas;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const faasToken = MTGYFaaS(web3, productContract);
    const [nativeBalance, serviceCost] = await Promise.all([
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCost", {
        productID,
        productContract,
      }),
    ]);
    if (new BigNumber(nativeBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }
    await dispatch("genericErc20Approval", {
      spendAmount: rewardsSupply,
      tokenAddress: rewardsToken,
      delegateAddress: productContract,
    });
    await faasToken.methods
      .createNewTokenContract(
        rewardsToken,
        stakableToken,
        rewardsSupply,
        perBlockNum,
        0,
        timelockSeconds,
        isStakedTokenNft || false
      )
      .send({ from: userAddy, value: serviceCost });
  },

  async removeStakableTokens({ state }, farmContractAddress) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const stakingContract = MTGYFaaSToken(web3, farmContractAddress);
    const pool = await stakingContract.methods.pool().call();
    if (!pool || pool.tokenOwner.toLowerCase() !== userAddy.toLowerCase()) {
      throw new Error(
        `You are not the original token owner who set up this pool.`
      );
    }
    await stakingContract.methods
      .removeStakeableTokens()
      .send({ from: userAddy });
  },
};
