import BigNumber from "bignumber.js";
import Web3Modal from "../../factories/web3/Web3Modal";
import MTGY from "../../factories/web3/MTGY";
import TrustedTimestamping from "../../factories/web3/TrustedTimestamping";
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  async init({ commit, dispatch, getters, state }, reset = false) {
    try {
      commit("SET_GLOBAL_ERROR", null);
      if (state.web3 && state.web3.isConnected && !reset) return;
      if (state.activeNetwork === "xlm") return;

      const web3Mod = Web3Modal();
      const web3 = await web3Mod.connect();
      commit("SET_WEB3_INSTANCE", web3);

      const isConnected = true;
      commit("SET_WEB3_IS_CONNECTED", isConnected);
      if (!isConnected) {
        return commit(
          "SET_GLOBAL_ERROR",
          new Error(`User not connected. Please connect to your wallet.`)
        );
      }

      commit("SET_WEB3_CHAIN_ID", await web3.eth.getChainId());
      if (!getters.activeNetwork) {
        throw new Error(
          `The selected network is not supported. Please connect to a supported network, ${state.eth.networks
            .map((n) => n.name)
            .join(", ")}`
        );
      }

      const [accountAddy] = await web3.eth.getAccounts();
      commit("SET_WEB3_USER_ADDRESS", accountAddy);

      await dispatch("ethCheckApprovalStatusForTokenContract");
      await dispatch("getHashes");
    } catch (err) {
      toast.error(err.message || err);
      commit("SET_GLOBAL_ERROR", err);
    }
  },

  disconnect({ commit }) {
    commit("SET_WEB3_INSTANCE", null);
    commit("SET_WEB3_IS_CONNECTED", false);
    commit("SET_WEB3_IS_APPROVED", false);
    commit("SET_WEB3_CHAIN_ID", null);
    commit("SET_WEB3_USER_ADDRESS", "");
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", []);
  },

  async ethCheckApprovalStatusForTokenContract({ getters, state, commit }) {
    const userAddy = state.web3.address;
    if (!userAddy) {
      commit("SET_WEB3_IS_CONNECTED", false);
      commit("SET_WEB3_IS_APPROVED", false);
      return;
    }

    const web3 = state.web3.instance;
    const mtgyAddress = getters.activeNetwork.mtgy;
    const trustedTimestampingAddress =
      getters.activeNetwork.trustedTimestamping;
    const contract = MTGY(web3, mtgyAddress);
    const ttCont = TrustedTimestamping(web3, trustedTimestampingAddress);
    const [timestampAllowance, currentCost] = await Promise.all([
      contract.methods.allowance(userAddy, trustedTimestampingAddress).call(),
      ttCont.methods.cost().call(),
    ]);
    const isApprovedAlready = new BigNumber(timestampAllowance).gte(
      currentCost
    );
    commit("SET_WEB3_IS_APPROVED", isApprovedAlready);
  },

  async ethApproveTokenContract({ getters, state, commit }) {
    try {
      const web3 = state.web3.instance;
      const userAddy = state.web3.address;
      const mtgyAddress = getters.activeNetwork.mtgy;
      const trustedTimestampingAddress =
        getters.activeNetwork.trustedTimestamping;
      const mtgyCont = MTGY(web3, mtgyAddress);
      await mtgyCont.methods
        .approve(trustedTimestampingAddress, 5000)
        .send({ from: userAddy });
      commit("SET_WEB3_IS_APPROVED", true);
    } catch (err) {
      toast.error(err.message || err);
      commit("SET_WEB3_IS_APPROVED", false);
      commit("SET_GLOBAL_ERROR", err);
    }
  },

  async sendTrustedTimestampTxn(
    { getters, state },
    { hash, fileName, fileSize }
  ) {
    const userAddy = state.web3.address;
    const trustedTimestampingAddress =
      getters.activeNetwork.trustedTimestamping;
    const web3Mod = Web3Modal();
    const web3 = await web3Mod.connect();
    const ttCont = TrustedTimestamping(web3, trustedTimestampingAddress);
    await ttCont.methods
      .storeHash(hash, fileName, fileSize)
      .send({ from: userAddy });

    // TODO refreshes hashes again
  },

  async getHashes({ commit, state, getters }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const trustedTimestampingAddress =
      getters.activeNetwork.trustedTimestamping;
    const ttCont = TrustedTimestamping(web3, trustedTimestampingAddress);
    const hashes = await ttCont.methods.getHashesFromAddress(userAddy).call();
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", hashes);
  },

  async setGlobalLoading({ commit }, isLoading) {
    commit("SET_GLOBAL_LOADING", isLoading);
  },
};
