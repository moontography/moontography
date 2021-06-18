import BigNumber from "bignumber.js";
import MTGY from "../../factories/web3/MTGY";
import MTGYTrustedTimestamping from "../../factories/web3/MTGYTrustedTimestamping";

export default {
  async trustedTimestampingInit({ dispatch }) {
    await Promise.all([
      dispatch("getTimestampingHashes"),
      dispatch("getTimestampingCost"),
    ]);
  },

  async sendTrustedTimestampTxn(
    { dispatch, getters, state },
    { hash, fileName, fileSize }
  ) {
    const userAddy = state.web3.address;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const trustedTimestampingAddress =
      getters.activeNetwork.contracts.trustedTimestamping;
    const web3 = state.web3.instance;
    const ttCont = MTGYTrustedTimestamping(web3, trustedTimestampingAddress);

    // make sure the current user has allowed the appropriate amount of MTGY to
    // spend on the timestamping service
    await dispatch("genericTokenApproval", {
      spendAmount: await ttCont.methods.mtgyServiceCost().call(),
      tokenAddress: mtgyAddy,
      delegateAddress: trustedTimestampingAddress,
    });

    // store the hash if we haven't bombed out yet
    await ttCont.methods
      .storeHash(hash, fileName, fileSize)
      .send({ from: userAddy });
  },

  async getTimestampingHashes({ commit, state, getters }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const trustedTimestampingAddress =
      getters.activeNetwork.contracts.trustedTimestamping;
    const ttCont = MTGYTrustedTimestamping(web3, trustedTimestampingAddress);
    const hashes = await ttCont.methods.getHashesForAddress(userAddy).call();
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", hashes);
  },

  async getTimestampingCost({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const trustedTimestampingAddress =
      getters.activeNetwork.contracts.trustedTimestamping;
    const ttCont = MTGYTrustedTimestamping(web3, trustedTimestampingAddress);
    const cost = await ttCont.methods.mtgyServiceCost().call();
    commit(
      "SET_TRUSTED_TIMESTAMPING_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },
};
