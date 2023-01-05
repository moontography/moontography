import BigNumber from "bignumber.js";
import sleep from "../../factories/Sleep";
import AtomicSwapOracle from "../../factories/AtomicSwapOracle";
import ERC20 from "@/factories/web3/ERC20";
import OKLGAtomicSwapInstance from "@/factories/web3/OKLGAtomicSwapInstance";
import OKLGAtomicSwap from "../../factories/web3/OKLGAtomicSwap";

export default {
  async asaasCosts({ commit, dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const productContract = getters.activeNetwork.contracts.atomicSwap;
    const productID = state.productIds.atomicSwap;
    const contract = OKLGAtomicSwap(web3, productContract);
    const [serviceCost, gas] = await Promise.all([
      dispatch("getProductCostWei", {
        productID,
        productContract,
      }),
      contract.methods.swapCreationGasLoadAmount().call(),
    ]);
    commit("SET_ASAAS_COSTS", {
      gas,
      serviceCost: new BigNumber(serviceCost)
        .div(new BigNumber(10).pow(18))
        .toFixed(),
    });
  },

  async asaasInstanceGasCost({ commit, dispatch, state }, contractAddress) {
    const web3 = state.web3.instance;
    const productID = state.productIds.atomicSwapInstance;
    const contract = OKLGAtomicSwapInstance(web3, contractAddress);
    const [serviceCost, instanceGasCost] = await Promise.all([
      dispatch("getProductCostWei", {
        productID,
        productContract: contractAddress,
      }),
      contract.methods.minimumGasForOperation().call(),
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
    const contract = OKLGAtomicSwap(web3, asaasAddy);
    const contract_V1 = asaasAddy_V1 && OKLGAtomicSwap(web3, asaasAddy_V1);
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
          const sourceSwapInst = OKLGAtomicSwapInstance(
            web3,
            swap.sourceContract
          );

          const isSwapActive = await sourceSwapInst.methods.isActive().call();
          if (!(isSwapActive && swap.isActive))
            throw new Error(
              `Swap doesn't appear to be active: source - ${swap.sourceContract}; target - ${swap.targetContract}`
            );

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
                console.info(`Error getting swap info`, err);
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
          const [token, unclaimedSentFromTargetSource] = await Promise.all([
            dispatch("getErc20TokenInfo", swapTokenAddy),
            (async () => {
              if (
                unclaimedSentFromTarget &&
                new BigNumber(unclaimedSentFromTarget.id).gt(0)
              ) {
                return await sourceSwapInst.methods
                  .swaps(unclaimedSentFromTarget.id)
                  .call();
              }
            })(),
          ]);
          const tokenCont = ERC20(web3, token.address);
          return {
            unclaimedSentFromSource,
            unclaimedSentFromTarget,
            unclaimedSentFromTargetSource,
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
          console.info(`Error getting swap`, err);
          return null;
        }
      })
    );
    commit(
      "SET_ASAAS_SWAPS",
      mappedSwaps
        .filter((s) => !!s)
        .sort((s1, s2) =>
          s1.token.name.toLowerCase() < s2.token.name.toLowerCase() ? -1 : 1
        )
    );
  },

  async asaasGetLatestUserSwap({ state }, sourceContract) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const contract = OKLGAtomicSwapInstance(web3, sourceContract);
    return await contract.methods.lastUserSwap(userAddy).call();
  },

  async sendTokensToSwap(
    { dispatch, getters, state },
    { amount, sourceContract, tokenContract }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const productID = state.productIds.atomicSwapInstance;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const contract = OKLGAtomicSwapInstance(web3, sourceContract);
    const [nativeBalance, serviceCost] = await Promise.all([
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCostWei", {
        productID,
        productContract: sourceContract,
      }),
    ]);
    const totalNativeNeeded = new BigNumber(
      state.asaas.instanceGasCost[sourceContract] || 0
    ).plus(serviceCost || 0);
    if (new BigNumber(nativeBalance).lt(totalNativeNeeded)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }

    await dispatch("genericErc20Approval", {
      spendAmount: amount,
      tokenAddress: tokenContract,
      delegateAddress: sourceContract,
    });
    return await contract.methods.receiveTokensFromSource(amount).send({
      from: userAddy,
      value: totalNativeNeeded.toFixed(),
    });
  },

  async asaasCreateSwap(
    { dispatch, getters, state },
    {
      tokenAddress,
      tokenSupply,
      maxSwapAmount,
      targetNetwork,
      targetContract,
      targetDecimals,
    }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const productContract = getters.activeNetwork.contracts.atomicSwap;
    const productID = state.productIds.atomicSwap;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const contract = OKLGAtomicSwap(web3, productContract);

    const [nativeBalance, serviceCost, valueToCreate] = await Promise.all([
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCostWei", {
        productID,
        productContract,
      }),
      contract.methods.swapCreationGasLoadAmount().call(),
    ]);
    const totalNativeNeeded = new BigNumber(valueToCreate || 0).plus(
      serviceCost || 0
    );
    if (new BigNumber(nativeBalance).lt(totalNativeNeeded)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }

    await dispatch("genericErc20Approval", {
      spendAmount: tokenSupply,
      tokenAddress: tokenAddress,
      delegateAddress: productContract,
    });
    await contract.methods
      .createNewAtomicSwapContract(
        tokenAddress,
        tokenSupply,
        maxSwapAmount,
        targetNetwork,
        targetContract,
        targetDecimals
      )
      .send({ from: userAddy, value: totalNativeNeeded.toFixed() });
    return await contract.methods.getLastCreatedContract(userAddy).call();
  },

  async asaasFundAndClaimTokens(
    { getters, state },
    { instContract, id, timestamp, amount }
  ) {
    const web3 = state.web3.instance;
    const activeNetwork = getters.activeNetwork;
    const userAddy = state.web3.address;
    const contract = OKLGAtomicSwapInstance(web3, instContract);
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
    const contract = OKLGAtomicSwapInstance(web3, instContract);
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
