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
    const instanceGasCost = await contract.methods
      .minimumGasForOperation()
      .call();
    commit("SET_ASAAS_INSTANCE_GAS_COST", { contractAddress, instanceGasCost });
  },

  async getAllSwapContracts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const activeNetwork = getters.activeNetwork;
    const asaasAddy = activeNetwork.contracts.atomicSwap;
    const contract = MTGYAtomicSwap(web3, asaasAddy);
    const allSwaps = await contract.methods.getAllSwapContracts().call();
    commit(
      "SET_ASAAS_SWAPS",
      await Promise.all(
        allSwaps.map(async (swap) => {
          const swapInstance = MTGYAtomicSwapInstance(
            web3,
            swap.sourceContract
          );
          const [swapTokenAddy, targetToken] = await Promise.all([
            swapInstance.methods.getSwapTokenAddress().call(),
            AtomicSwapOracle.getSwap({
              userAddress: userAddy,
              sourceNetwork: activeNetwork.short_name,
              sourceContract: swap.sourceContract,
            }),
          ]);
          return {
            token: await dispatch("getErc20TokenInfo", swapTokenAddy),
            targetToken,
            ...swap,
          };
        })
      )
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
};
