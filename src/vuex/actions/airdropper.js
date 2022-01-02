import BigNumber from "bignumber.js";
// import OKLG from "../../factories/web3/OKLG";
import OKLGAirdropper from "@/factories/web3/OKLGAirdropper";

export default {
  async getAirdropperCost({ commit, dispatch, getters, state }) {
    const productContract = getters.activeNetwork.contracts.airdropper;
    const productID = state.productIds.airdropper;
    const cost = await dispatch("getProductCostWei", {
      productID,
      productContract,
    });
    commit(
      "SET_AIRDROPPER_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async airdropTokens(
    { dispatch, getters, state },
    { tokenAddress, addresses, isNft }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const airdropperProdId = state.productIds.airdropper;
    const airdropperAddy = getters.activeNetwork.contracts.airdropper;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const airdropContract = OKLGAirdropper(web3, airdropperAddy);
    const [tokenInfo, nativeBalance, serviceCost] = await Promise.all([
      dispatch(
        isNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
        tokenAddress
      ),
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCostWei", {
        productID: airdropperProdId,
        productContract: airdropperAddy,
      }),
    ]);
    if (new BigNumber(nativeBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }

    const addressesFormatted = addresses.map(({ address, tokens }) => {
      return {
        userAddress: address,
        amountToReceive: isNft
          ? new BigNumber(tokens).toFixed(0)
          : new BigNumber(tokens)
              .times(new BigNumber(10).pow(tokenInfo.decimals))
              .toFixed(0),
      };
    });

    const totalAmount = isNft
      ? addressesFormatted.length
      : addressesFormatted.reduce(
          (total, info) =>
            new BigNumber(total).plus(info.amountToReceive).toFixed(0),
          0
        );
    if (new BigNumber(tokenInfo.userBalance).lt(totalAmount)) {
      throw new Error(
        `You do not have the amount of ${tokenInfo.symbol} to airdrop this many tokens. Please ensure you have the appropriate amount of tokens and try again.`
      );
    }

    // Approve airdrop contract to send rewards token from airdropper
    if (isNft) {
      await dispatch("genericErc721Approval", {
        tokenAddress: tokenAddress,
        delegateAddress: airdropperAddy,
      });
    } else {
      await dispatch("genericErc20Approval", {
        spendAmount: totalAmount,
        tokenAddress: tokenAddress,
        delegateAddress: airdropperAddy,
      });
    }

    let airdropMethod = "bulkSendErc20Tokens";
    if (isNft) {
      airdropMethod = "bulkSendErc721Tokens";
    }
    await airdropContract.methods[airdropMethod](
      tokenAddress,
      addressesFormatted.map(({ userAddress, amountToReceive }) => [
        userAddress,
        amountToReceive,
      ])
    ).send({ from: userAddy, value: serviceCost });
  },
};
