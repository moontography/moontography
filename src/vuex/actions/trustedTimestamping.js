import BigNumber from "bignumber.js";
import OKLGTrustedTimestamping from "../../factories/web3/OKLGTrustedTimestamping";

export default {
  async trustedTimestampingInit({ dispatch }) {
    await Promise.all([
      dispatch("getTimestampingHashes"),
      dispatch("getTimestampingCost"),
    ]);
  },

  async getTimestampingCost({ commit, dispatch, getters, state }) {
    const productContract = getters.activeNetwork.contracts.trustedTimestamping;
    const productID = state.productIds.trustedTimestamping;
    const cost = await dispatch("getProductCost", {
      productID,
      productContract,
    });
    commit(
      "SET_TRUSTED_TIMESTAMPING_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async sendTrustedTimestampTxn(
    { dispatch, getters, state },
    { hash, fileName, fileSize }
  ) {
    const userAddy = state.web3.address;
    const productContract = getters.activeNetwork.contracts.trustedTimestamping;
    const productID = state.productIds.trustedTimestamping;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const web3 = state.web3.instance;
    const ttCont = OKLGTrustedTimestamping(web3, productContract);

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

    // store the hash if we haven't bombed out yet
    await ttCont.methods
      .storeHash(hash, fileName, fileSize)
      .send({ from: userAddy, value: serviceCost });
  },

  async getTimestampingHashes({ commit, state, getters }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const trustedTimestampingAddress =
      getters.activeNetwork.contracts.trustedTimestamping;
    const ttCont = OKLGTrustedTimestamping(web3, trustedTimestampingAddress);
    const hashes = await ttCont.methods.getHashesForAddress(userAddy).call();
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", hashes);
  },
};
