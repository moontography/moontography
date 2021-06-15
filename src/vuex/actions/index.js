import passwordManager from "./passwordManager";
import trustedTimestamping from "./trustedTimestamping";

import BigNumber from "bignumber.js";
import DexUtils from "../../factories/DexUtils";
import Web3Modal from "../../factories/web3/Web3Modal";
import ERC20 from "../../factories/web3/ERC20";
import { useToast } from "vue-toastification";
import MTGYDataUtils from "@/factories/MTGYDataUtils";
const toast = useToast();

export default {
  ...passwordManager,
  ...trustedTimestamping,

  async init({ commit, dispatch, getters, state }, reset = false) {
    try {
      commit("SET_INIT_LOADING", true);
      commit("SET_GLOBAL_ERROR", null);
      await Promise.all([
        dispatch("getMtgyPriceUsd"),
        dispatch("getMTGYCirculatingSupply"),
        dispatch("getMtgyTokenInfo"),
        dispatch("getMtgyTokenChart"),
      ]);

      if (!window.web3) {
        return commit(
          "SET_GLOBAL_ERROR",
          new Error(
            `Make sure you using a web3 enabled browser like Metamask, TrustWallet etc.`
          )
        );
      }
      if (state.web3 && state.web3.isConnected && !reset) return;
      if (state.activeNetwork === "xlm") return;

      const { web3 } = await Web3Modal.connect();
      commit("SET_WEB3_INSTANCE", web3);

      commit("SET_WEB3_IS_CONNECTED", true);

      const resetConnection = async () => {
        dispatch("disconnect");
        await dispatch("init", true);
      };
      Web3Modal.bindProviderEvents({
        accountsChanged: resetConnection,
        chainChanged: resetConnection,
        disconnect: () => dispatch("disconnect"),
      });

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
      const { userBalance, decimals } = await dispatch(
        "getErc20TokenInfo",
        getters.activeNetwork.contracts.mtgy
      );
      commit(
        "SET_WEB3_USER_MTGY_BALANCE",
        new BigNumber(userBalance)
          .div(new BigNumber(10).pow(decimals))
          .toString()
      );
    } catch (err) {
      toast.error(err.message || err);
      commit("SET_GLOBAL_ERROR", err);
    } finally {
      commit("SET_INIT_LOADING", false);
    }
  },

  async trustedTimestampingInit({ dispatch }) {
    await Promise.all([
      dispatch("getTimestampingHashes"),
      dispatch("getTimestampingCost"),
    ]);
  },

  disconnect({ commit }) {
    commit("SET_WEB3_INSTANCE", null);
    commit("SET_WEB3_IS_CONNECTED", false);
    commit("SET_WEB3_CHAIN_ID", null);
    commit("SET_WEB3_USER_ADDRESS", "");
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", []);
  },

  // async ethCheckApprovalStatusForTokenContract({ getters, state, commit }) {
  //   const userAddy = state.web3.address;
  //   if (!userAddy) {
  //     commit("SET_WEB3_IS_CONNECTED", false);
  //     return;
  //   }

  //   const web3 = state.web3.instance;
  //   const mtgyAddress = getters.activeNetwork.contracts.mtgy;
  //   const trustedTimestampingAddress =
  //     getters.activeNetwork.contracts.trustedTimestamping;
  //   const contract = MTGY(web3, mtgyAddress);
  //   const ttCont = MTGYTrustedTimestamping(web3, trustedTimestampingAddress);
  //   const [timestampAllowance, currentCost] = await Promise.all([
  //     contract.methods.allowance(userAddy, trustedTimestampingAddress).call(),
  //     ttCont.methods.mtgyServiceCost().call(),
  //   ]);
  //   const isApprovedAlready = new BigNumber(timestampAllowance).gte(
  //     currentCost
  //   );
  //   commit("SET_WEB3_IS_APPROVED", isApprovedAlready);
  // },

  // async ethApproveTokenContract(
  //   { getters, state, commit },
  //   { address, amount }
  // ) {
  //   try {
  //     const web3 = state.web3.instance;
  //     const userAddy = state.web3.address;
  //     const mtgyAddress = getters.activeNetwork.contracts.mtgy;
  //     // const trustedTimestampingAddress =
  //     //   getters.activeNetwork.contracts.trustedTimestamping;
  //     const mtgyCont = MTGY(web3, mtgyAddress);
  //     await mtgyCont.methods.approve(address, amount).send({ from: userAddy });
  //     commit("SET_WEB3_IS_APPROVED", true);
  //   } catch (err) {
  //     toast.error(err.message || err);
  //     commit("SET_WEB3_IS_APPROVED", false);
  //     commit("SET_GLOBAL_ERROR", err);
  //   }
  // },

  async getMtgyPriceUsd({ commit }) {
    const price = await DexUtils.getTokenPrice(
      "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23"
    );
    commit("SET_MTGY_PRICE_USD", price);
  },

  async getMTGYCirculatingSupply({ commit }) {
    const supply = await MTGYDataUtils.getCirculatingSupply();
    commit("SET_MTGY_CIRC_SUPPLY", supply);
  },

  async getMtgyTokenInfo({ commit }) {
    const info = await MTGYDataUtils.getTokenInfo("the-moontography-project");
    commit("SET_MTGY_TOKEN_INFO", info);
  },

  async getMtgyTokenChart({ commit }) {
    const prices = await MTGYDataUtils.getTokenChart(
      "the-moontography-project"
    );
    commit("SET_MTGY_TOKEN_CHART", prices);
  },

  async setUserInfoForToken({ commit, dispatch }, tokenAddy) {
    const info = await dispatch("getErc20TokenInfo", tokenAddy);

    commit("SET_SELECTED_ADDRESS_INFO", {
      ...info,
      userBalance: new BigNumber(info.userBalance)
        .div(new BigNumber(10).pow(info.decimals))
        .toString(),
    });
  },

  async getErc20TokenInfo({ state }, tokenAddy) {
    const userAddy = state.web3.address;
    const contract = ERC20(state.web3.instance, tokenAddy);
    const [name, symbol, decimals, userBalance] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.balanceOf(userAddy).call(),
    ]);
    return {
      name,
      symbol,
      decimals,
      userBalance,
    };
  },
};
