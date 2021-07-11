import BigNumber from "bignumber.js";
import MTGY from "../../factories/web3/MTGY";
import MTGYFaaS from "../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../factories/web3/MTGYFaaSToken";
import MTGYFaaSTokenV1 from "../../factories/web3/MTGYFaaSTokenV1";
import TxnToast from "@/components/TxnToast";
import { useToast } from "vue-toastification";
const toast = useToast();


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
    const faasAddyV11 = getters.activeNetwork.contracts.faas_V11;
    const contract = MTGYFaaS(web3, faasAddy);
    let tokensUserIsTaking = await contract.methods
      .getUserStakingContracts(userAddy)
      .call();
    // if (faasAddyV11) {
    //   const contractV11 = MTGYFaaS(web3, faasAddyV11);
    //   const v11TokensUserIsTaking = await contractV11.methods
    //     .getUserStakingContracts(userAddy)
    //     .call();
    //   tokensUserIsTaking = tokensUserIsTaking.concat(v11TokensUserIsTaking);
    // }
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
            poolInfo,
            contractIsRemoved,
            farmingInfo,
          ] = await Promise.all([
            farmingCont.methods.stakedTokenAddress().call(),
            farmingCont.methods.rewardsTokenAddress().call(),
            farmingCont.methods.getLastStakableBlock().call(),
            farmingCont.methods.pool().call(),
            farmingCont.methods.contractIsRemoved().call(),
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
            dispatch("getErc20TokenInfo", tokenAddy),
            dispatch("getErc20TokenInfo", rewardAddy),
          ]);
          return {
            farmingTokenAddy,
            tokenAddy,
            lastStakableBlock,
            poolInfo,
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
      dispatch("getErc20TokenInfo", stakingContract),
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
    { dispatch, state, getters },
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
    const tx = await faasToken.methods
      .stakeTokens(amountTokens)
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
  },

  async faasUnstakeTokens(
    { state, getters },
    { farmingContractAddress, amountTokens, harvestTokens }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    if (!amountTokens) {
      amountTokens = await faasToken.methods.balanceOf(userAddy).call();
    }
    const tx = await faasToken.methods
      .unstakeTokens(
        amountTokens,
        typeof harvestTokens === "boolean" ? harvestTokens : true
      )
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
  },

  async faasEmergencyUnstake({ state, getters }, { farmingContractAddress }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    const tx = await faasToken.methods
      .emergencyUnstake()
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
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
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const faasAddy = getters.activeNetwork.contracts.faas;
    const mtgyCont = MTGY(web3, mtgyAddy);
    const faasToken = MTGYFaaS(web3, faasAddy);
    const [mtgyBalance, serviceCost] = await Promise.all([
      mtgyCont.methods.balanceOf(userAddy).call(),
      faasToken.methods.mtgyServiceCost().call(),
    ]);
    if (new BigNumber(mtgyBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have the amount of MTGY to cover the service cost. Please ensure you have enough MTGY in your wallet to cover the service fee and try again.`
      );
    }
    await dispatch("genericTokenApproval", {
      spendAmount: serviceCost,
      tokenAddress: mtgyAddy,
      delegateAddress: faasAddy,
    });
    await dispatch("genericTokenApproval", {
      spendAmount: rewardsSupply,
      tokenAddress: rewardsToken,
      delegateAddress: faasAddy,
    });
    const tx = await faasToken.methods
      .createNewTokenContract(
        rewardsToken,
        stakableToken,
        rewardsSupply,
        perBlockNum,
        0,
        timelockSeconds
      )
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
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
