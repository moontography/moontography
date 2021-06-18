import BigNumber from "bignumber.js";
import ERC20 from "../../factories/web3/ERC20";
import MTGYFaaSToken from "../../factories/web3/MTGYFaaSToken";

export default {
  async faasHarvestTokens({ state }, tokenAddy) {
    const userAddy = state.web3.address;
    // const faasAddress = getters.activeNetwork.contracts.faas;
    const web3 = state.web3.instance;
    const contract = MTGYFaaSToken(web3, tokenAddy);
    await contract.methods.harvestTokens().send({ from: userAddy });
  },

  async getFaasStakingInfo({ dispatch, state }, farmingAddy) {
    const web3 = state.web3.instance;
    const faasToken = MTGYFaaSToken(web3, farmingAddy);
    const [
      stakingContract,
      rewardsContract,
      tokensRewardedPerBlock,
      lastBlock,
      currentBlock,
    ] = await Promise.all([
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
      tokensRewardedPerBlock,
      currentBlock,
      lastBlock,
      stakingTokenInfo,
      rewardsTokenInfo,
    };
  },

  async faasStakeTokens(
    { state },
    { farmingContractAddress, stakingContractAddress, amountTokens }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    const stakingToken = ERC20(web3, stakingContractAddress);
    const stakingAllowance = await stakingToken.methods
      .allowance(userAddy, farmingContractAddress)
      .call();
    if (new BigNumber(stakingAllowance).lt(amountTokens)) {
      await stakingToken.methods
        .approve(farmingContractAddress, amountTokens)
        .send({ from: userAddy });
    }
    await faasToken.methods.stakeTokens(amountTokens).send({ from: userAddy });
  },
};
