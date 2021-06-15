import BigNumber from "bignumber.js";
import MTGY from "../../factories/web3/MTGY";
import MTGYTrustedTimestamping from "../../factories/web3/MTGYTrustedTimestamping";

export default {
  async sendTrustedTimestampTxn(
    { getters, state },
    { hash, fileName, fileSize }
  ) {
    const userAddy = state.web3.address;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const trustedTimestampingAddress =
      getters.activeNetwork.contracts.trustedTimestamping;
    const web3 = state.web3.instance;
    const mtgyCont = MTGY(web3, mtgyAddy);
    const ttCont = MTGYTrustedTimestamping(web3, trustedTimestampingAddress);

    // make sure the current user has allowed the appropriate amount of MTGY to
    // spend on the timestamping service
    const [currentApprovalAmount, currentTtCost] = await Promise.all([
      mtgyCont.methods.allowance(userAddy, trustedTimestampingAddress).call(),
      ttCont.methods.mtgyServiceCost().call(),
    ]);
    if (new BigNumber(currentApprovalAmount).lt(currentTtCost)) {
      await mtgyCont.methods
        .approve(trustedTimestampingAddress, currentTtCost)
        .send({ from: userAddy });
    }

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
