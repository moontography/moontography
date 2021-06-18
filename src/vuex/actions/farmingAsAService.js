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
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingAddy);
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

  async faasUnstakeTokens({ state }, { farmingContractAddress, amountTokens }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const faasToken = MTGYFaaSToken(web3, farmingContractAddress);
    if (!amountTokens) {
      amountTokens = await faasToken.methods.balanceOf(userAddy).call();
    }
    await faasToken.methods
      .unstakeTokens(amountTokens)
      .send({ from: userAddy });
  },
};
