// import BigNumber from "bignumber.js";
// import MTGY from "../../factories/web3/MTGY";
import AtomicSwapOracle from "../../factories/AtomicSwapOracle";
import MTGYAtomicSwapInstance from "@/factories/web3/MTGYAtomicSwapInstance";
import MTGYAtomicSwap from "../../factories/web3/MTGYAtomicSwap";

export default {
  async asaasCosts({ commit, getters, state }) {
    const web3 = state.web3.instance;
    // const userAddy = state.web3.address;
    const asaasAddy = getters.activeNetwork.contracts.atomicSwap;
    const contract = MTGYAtomicSwap(web3, asaasAddy);
    const [mtgyServiceCost, gas] = await Promise.all([
      contract.methods.mtgyServiceCost().call(),
      contract.methods.swapCreationGasLoadAmount().call(),
    ]);
    commit("SET_ASAAS_COSTS", { mtgyServiceCost, gas });
  },

  async asaasInstanceGasCost({ commit, state }, contractAddress) {
    const web3 = state.web3.instance;
    // const userAddy = state.web3.address;
    // const activeNetwork = getters.activeNetwork;
    const contract = MTGYAtomicSwapInstance(web3, contractAddress);
    const [instanceGasCost, serviceCost] = await Promise.all([
      contract.methods.minimumGasForOperation().call(),
      contract.methods.mtgyServiceCost().call(),
    ]);
    commit("SET_ASAAS_INSTANCE_GAS_COST", { contractAddress, instanceGasCost });
    commit("SET_ASAAS_INSTANCE_SERVICE_COST", serviceCost);
  },

  async getAllSwapContracts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const activeNetwork = getters.activeNetwork;
    const asaasAddy = activeNetwork.contracts.atomicSwap;
    const contract = MTGYAtomicSwap(web3, asaasAddy);
    const allSwaps = await contract.methods.getAllSwapContracts().call();
    const mappedSwaps = await Promise.all(
      allSwaps.map(async (swap) => {
        const sourceSwapInst = MTGYAtomicSwapInstance(
          web3,
          swap.sourceContract
        );
        const [
          swapTokenAddy,
          targetToken,
          hasUnclaimedTokens,
        ] = await Promise.all([
          sourceSwapInst.methods.getSwapTokenAddress().call(),
          AtomicSwapOracle.getSwap({
            userAddress: userAddy,
            sourceNetwork: activeNetwork.short_name,
            sourceContract: swap.sourceContract,
          }),
          sourceSwapInst.methods.lastUserSwap(userAddy).call(),
        ]);
        return {
          hasUnclaimedTokens,
          token: await dispatch("getErc20TokenInfo", swapTokenAddy),
          targetToken,
          ...swap,
        };
      })
    );
    commit(
      "SET_ASAAS_SWAPS",
      mappedSwaps.filter((s) => s.isActive)
    );
  },

  async asaasGetLatestUserSwap({ state }, sourceContract) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const contract = MTGYAtomicSwapInstance(web3, sourceContract);
    return await contract.methods.lastUserSwap(userAddy).call();
  },

  async sendTokensToSwap(
    { dispatch, getters, state },
    { amount, sourceContract, tokenContract }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const contract = MTGYAtomicSwapInstance(web3, sourceContract);
    const instanceServiceCost = await contract.methods.mtgyServiceCost().call();
    await dispatch("genericTokenApproval", {
      spendAmount: instanceServiceCost,
      tokenAddress: mtgyAddy,
      delegateAddress: sourceContract,
    });
    await dispatch("genericTokenApproval", {
      spendAmount: amount,
      tokenAddress: tokenContract,
      delegateAddress: sourceContract,
    });
    return await contract.methods.receiveTokensFromSource(amount).send({
      from: userAddy,
      value: state.asaas.instanceGasCost[sourceContract],
    });
  },

  async asaasCreateSwap(
    { dispatch, getters, state },
    { tokenAddress, tokenSupply, maxSwapAmount, targetNetwork, targetContract }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const asaasAddy = getters.activeNetwork.contracts.atomicSwap;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const contract = MTGYAtomicSwap(web3, asaasAddy);
    const [mtgyServiceCost, valueToCreate] = await Promise.all([
      contract.methods.mtgyServiceCost().call(),
      contract.methods.swapCreationGasLoadAmount().call(),
    ]);
    await dispatch("genericTokenApproval", {
      spendAmount: mtgyServiceCost,
      tokenAddress: mtgyAddy,
      delegateAddress: asaasAddy,
    });
    await contract.methods
      .createNewAtomicSwapContract(
        tokenAddress,
        tokenSupply,
        maxSwapAmount,
        targetNetwork,
        targetContract
      )
      .send({ from: userAddy, value: valueToCreate });
    return await contract.methods.getLastCreatedContract(userAddy).call();
  },

  async fundAndClaimTokens(
    { getters, state },
    { instContract, id, timestamp, amount }
  ) {
    const web3 = state.web3.instance;
    const activeNetwork = getters.activeNetwork;
    const userAddy = state.web3.address;
    const contract = MTGYAtomicSwapInstance(web3, instContract);
    const [valueToSend, currentSwap] = await Promise.all([
      contract.methods.minimumGasForOperation().call(),
      contract.methods.swaps(id).call(),
    ]);
    if (!currentSwap.isSendGasFunded) {
      await contract.methods
        .fundSendToDestinationGas(id, timestamp, amount)
        .send({ from: userAddy, value: valueToSend });
    }
    return await AtomicSwapOracle.sendTokens({
      targetNetwork: activeNetwork.short_name,
      targetContract: instContract,
      targetSwapId: id,
    });
  },
};
