import BigNumber from "bignumber.js";
import sleep from "../../factories/Sleep";
// import MTGY from "../../factories/web3/MTGY";
import AtomicSwapOracle from "../../factories/AtomicSwapOracle";
import ERC20 from "@/factories/web3/ERC20";
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
    commit("SET_ASAAS_INSTANCE_SERVICE_COST", { contractAddress, serviceCost });
  },

  async getAllSwapContracts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const activeNetwork = getters.activeNetwork;
    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getAllSwapContracts");
    }
    const asaasAddy = activeNetwork.contracts.atomicSwap;
    const asaasAddy_V1 = activeNetwork.contracts.atomicSwap_V1;
    const contract = MTGYAtomicSwap(web3, asaasAddy);
    const contract_V1 = asaasAddy_V1 && MTGYAtomicSwap(web3, asaasAddy_V1);
    const [allSwaps, allSwaps_V1] = await Promise.all([
      contract.methods.getAllSwapContracts().call(),
      (async () => {
        if (contract_V1) {
          return await contract_V1.methods.getAllSwapContracts().call();
        }
        return [];
      })(),
    ]);
    const mappedSwaps = await Promise.all(
      allSwaps.concat(allSwaps_V1).map(async (swap) => {
        try {
          const sourceSwapInst = MTGYAtomicSwapInstance(
            web3,
            swap.sourceContract
          );

          const isSwapActive = await sourceSwapInst.methods.isActive().call();
          if (!(isSwapActive && swap.isActive)) return null;

          const [
            swapTokenAddy,
            targetToken,
            unclaimedSentFromSource,
            { swap: unclaimedSentFromTarget },
          ] = await Promise.all([
            sourceSwapInst.methods.getSwapTokenAddress().call(),
            (async () => {
              try {
                return await AtomicSwapOracle.getSwap({
                  userAddress: userAddy,
                  sourceNetwork: activeNetwork.short_name,
                  sourceContract: swap.sourceContract,
                });
              } catch (err) {
                console.error(`Error getting swap info`, err);
                return null;
              }
            })(),
            (async () => {
              const lastUserSwap = await sourceSwapInst.methods
                .lastUserSwap(userAddy)
                .call();
              if (lastUserSwap) {
                return await sourceSwapInst.methods
                  .swaps(lastUserSwap.id)
                  .call();
              }
            })(),
            (async () => {
              try {
                return await AtomicSwapOracle.getLastUserSwap(
                  swap.targetNetwork,
                  userAddy,
                  swap.targetContract
                );
              } catch (err) {
                console.error(`Error getting target unclaimed info`, err);
                return null;
              }
            })(),
          ]);
          const token = await dispatch("getErc20TokenInfo", swapTokenAddy);
          const tokenCont = ERC20(web3, token.address);
          return {
            unclaimedSentFromSource,
            unclaimedSentFromTarget,
            targetToken,
            token: {
              ...token,
              contractBalance: await tokenCont.methods
                .balanceOf(swap.sourceContract)
                .call(),
            },
            ...swap,
          };
        } catch (err) {
          console.error(`Error get swap`, err);
          return null;
        }
      })
    );
    commit(
      "SET_ASAAS_SWAPS",
      mappedSwaps.filter((s) => !!s)
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
    const mtgyCont = ERC20(web3, mtgyAddy);
    const contract = MTGYAtomicSwapInstance(web3, sourceContract);
    const [instanceServiceCost, userMtgyBal] = await Promise.all([
      contract.methods.mtgyServiceCost().call(),
      mtgyCont.methods.balanceOf(userAddy).call(),
    ]);

    // validate amount is valid
    const servCostHumanReadable = new BigNumber(instanceServiceCost)
      .div(new BigNumber(10).pow(18))
      .toFormat();
    if (new BigNumber(instanceServiceCost).gt(userMtgyBal)) {
      throw new Error(
        `You need to make sure you have at least ${servCostHumanReadable} MTGY to spend to use this service.`
      );
    } else if (tokenContract.toLowerCase() === mtgyAddy.toLowerCase()) {
      // need to make sure the send amount is less than the
      // user's balance and mtgyServiceCost
      if (
        new BigNumber(userMtgyBal).lt(
          new BigNumber(instanceServiceCost).plus(amount)
        )
      ) {
        throw new Error(
          `You need to make sure the amount you swap leaves you with at least ${servCostHumanReadable} MTGY to cover the service cost.`
        );
      }
    }

    if (new BigNumber(instanceServiceCost).gt(0)) {
      await dispatch("genericTokenApproval", {
        spendAmount: instanceServiceCost,
        tokenAddress: mtgyAddy,
        delegateAddress: sourceContract,
      });
    }
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
    if (new BigNumber(mtgyServiceCost).gt(0)) {
      await dispatch("genericTokenApproval", {
        spendAmount: mtgyServiceCost,
        tokenAddress: mtgyAddy,
        delegateAddress: asaasAddy,
      });
    }
    await dispatch("genericTokenApproval", {
      spendAmount: tokenSupply,
      tokenAddress: tokenAddress,
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

  async asaasFundAndClaimTokens(
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
    await AtomicSwapOracle.sendTokens({
      targetNetwork: activeNetwork.short_name,
      targetContract: instContract,
      targetSwapId: id,
    });

    // poll for completion status to handle txns taking longer than
    // the 30 second HTTP limit (some chains can be deathly slow/congested)
    let isComplete = false;
    let tries = 0;
    let waitIntervalSec = 5;
    let numTotalTries = (2 * 60) / 5; // 2 min of tries
    while (!isComplete && tries < numTotalTries) {
      const { source, target } = await AtomicSwapOracle.sendTokens({
        checkOnly: true,
        targetNetwork: activeNetwork.short_name,
        targetContract: instContract,
        targetSwapId: id,
      });
      // If 'source' is complete it means the user received their tokens
      // which is all they care about anyway, so only check source for now
      // isComplete = source && target;
      isComplete = source;
      if (!isComplete) {
        await sleep(waitIntervalSec * 1e3);
      }
      tries++;
    }
    if (tries >= numTotalTries) {
      throw new Error(
        `Please check and confirm your tokens have landed in your wallet. If not please try clicking the claim button one more time. If you see this message again, please contract support to claim your tokens.`
      );
    }
  },

  async asaasRefundTokens(
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
    await AtomicSwapOracle.refundTokens({
      targetNetwork: activeNetwork.short_name,
      targetContract: instContract,
      targetSwapId: id,
    });

    // poll for completion status to handle txns taking longer than
    // the 30 second HTTP limit (some chains can be deathly slow/congested)
    let isComplete = false;
    let tries = 0;
    let waitIntervalSec = 5;
    let numTotalTries = (2 * 60) / 5; // 2 min of tries
    while (!isComplete && tries < numTotalTries) {
      const { source: isRefundedYet } = await AtomicSwapOracle.refundTokens({
        checkOnly: true,
        targetNetwork: activeNetwork.short_name,
        targetContract: instContract,
        targetSwapId: id,
      });
      // If 'source' is complete it means the user received got refunded
      isComplete = isRefundedYet;
      if (!isComplete) {
        await sleep(waitIntervalSec * 1e3);
      }
      tries++;
    }
    if (tries >= numTotalTries) {
      throw new Error(
        `Please check and confirm your tokens have landed in your wallet. If not please try clicking the refund button one more time. If you see this message again, please contract support to refund your tokens.`
      );
    }
  },
};
