import airdropper from "./airdropper";
import asaas from "./asaas";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import trustedTimestamping from "./trustedTimestamping";

import BigNumber from "bignumber.js";
import DexUtils from "../../factories/DexUtils";
import ExponentialBackoff from "../../factories/ExponentialBackoff";
import Web3Modal from "../../factories/web3/Web3Modal";
import ERC20 from "../../factories/web3/ERC20";
import ERC721 from "../../factories/web3/ERC721";
import { useToast } from "vue-toastification";
import MTGYDataUtils from "@/factories/MTGYDataUtils";
const toast = useToast();

export default {
  ...airdropper,
  ...asaas,
  ...faas,
  ...kether,
  ...passwordManager,
  ...trustedTimestamping,

  async init({ commit, dispatch, getters, state }, reset = false) {
    try {
      commit("SET_INIT_LOADING", true);
      commit("SET_GLOBAL_ERROR", null);

      // an error with this API will break the app if we await, so don't here
      dispatch("getMtgyPriceUsd");

      // Get MTGY info before having to connect wallet.
      // Allows dashboard data to be shown even if user does not connect wallet.

      await ExponentialBackoff(async () => {
        await Promise.all([
          dispatch("getMTGYCirculatingSupply"),
          dispatch("getMTGYTotalSupply"),
          dispatch("getMtgyTokenInfo"),
          dispatch("getMtgyTokenChart"),
          dispatch("getCurrentBlock"),
        ]);
      });

      if (!window.web3) {
        return commit(
          "SET_GLOBAL_ERROR",
          new Error(
            "Make sure you using a web3 enabled browser like Metamask, TrustWallet etc."
          )
        );
      }
      if (state.web3 && state.web3.isConnected && !reset) return;
      if (state.activeNetwork === "xlm") return;

      // Remove loader to connect wallet
      commit("SET_INIT_LOADING", false);

      const { provider, web3 } = await Web3Modal.connect();
      commit("SET_WEB3_PROVIDER", provider);
      commit("SET_WEB3_INSTANCE", web3);
      commit("SET_WEB3_IS_CONNECTED", true);

      // Add loader back
      commit("SET_INIT_LOADING", true);

      const resetConnection = async () => {
        dispatch("disconnect");
        // const currentRoute = state.route;
        // router.push("/redirecting");
        // router.push(currentRoute);
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
      await dispatch("refreshable");
    } catch (err) {
      toast.error(err.message || err);
      commit("SET_GLOBAL_ERROR", new Error(err));
    } finally {
      commit("SET_INIT_LOADING", false);
    }
  },

  async getUserBalance({ commit, dispatch, getters }) {
    const { userBalance, decimals } = await dispatch(
      "getErc20TokenInfo",
      getters.activeNetwork.contracts.mtgy
    );
    commit(
      "SET_WEB3_USER_MTGY_BALANCE",
      new BigNumber(userBalance).div(new BigNumber(10).pow(decimals)).toString()
    );
  },

  async refreshable({ dispatch, state }) {
    if (state.refreshableInterval) return;

    const go = async () => {
      try {
        // an error with this API will break the app if we await, so don't here
        dispatch("getMtgyPriceUsd");

        await Promise.all([
          dispatch("getUserBalance"),
          dispatch("getMTGYCirculatingSupply"),
          dispatch("getMTGYTotalSupply"),
          dispatch("getMtgyTokenInfo"),
          dispatch("getMtgyTokenChart"),
          dispatch("getCurrentBlock"),
        ]);
      } catch (err) {
        console.error(`Error refreshing data`, err);
      }
    };
    state.refreshableInterval = setInterval(go, 10000);
    await go();
  },

  disconnect({ commit }) {
    commit("SET_WEB3_PROVIDER", null);
    commit("SET_WEB3_INSTANCE", null);
    commit("SET_WEB3_IS_CONNECTED", false);
    commit("SET_WEB3_CHAIN_ID", null);
    commit("SET_WEB3_USER_ADDRESS", "");
    commit("SET_TRUSTED_TIMESTAMPING_HASHES", []);

    // Clear cached provider to be able to switch between providers when disconnecting wallet
    Web3Modal.clearCachedProvider();
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

  async getCurrentBlock({ state, commit }) {
    const web3 = state.web3.instance;
    if (!web3) return;
    const block = await web3.eth.getBlockNumber();
    commit("SET_CURRENT_BLOCK", block);
  },

  async getMtgyPriceUsd({ commit }) {
    const price = await DexUtils.getTokenPrice(
      "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23"
    );
    commit("SET_MTGY_PRICE_USD", price);
  },

  async getMTGYCirculatingSupply({ commit, state }, reset = false) {
    if (state.mtgyCircSupply != "0" && !reset) return;
    const supply = await MTGYDataUtils.getCirculatingSupply();
    commit("SET_MTGY_CIRC_SUPPLY", supply);
  },

  async getMTGYTotalSupply({ commit, state }, reset = false) {
    if (state.mtgyTotSupply != "0" && !reset) return;
    const supply = await MTGYDataUtils.getTotalSupply();
    commit("SET_MTGY_TOT_SUPPLY", supply);
  },

  async getMtgyTokenInfo({ commit }) {
    const info = await MTGYDataUtils.getTokenInfo("moontography");
    commit("SET_MTGY_TOKEN_INFO", info);
  },

  async getMtgyTokenChart({ commit, state }, reset = false) {
    if (state.mtgyChart && state.mtgyChart.length > 0 && !reset) return;
    const prices = await MTGYDataUtils.getTokenChart("moontography");
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

  async genericErc20Approval(
    { state },
    { spendAmount, tokenAddress, delegateAddress, unlimited }
  ) {
    if (new BigNumber(spendAmount || 0).lte(0)) return;

    unlimited = unlimited === false ? false : true;
    const userAddy = state.web3.address;
    const contract = ERC20(state.web3.instance, tokenAddress);
    const [userBalance, currentAllowance] = await ExponentialBackoff(
      async () => {
        return await Promise.all([
          contract.methods.balanceOf(userAddy).call(),
          contract.methods.allowance(userAddy, delegateAddress).call(),
        ]);
      }
    );
    if (new BigNumber(currentAllowance).lte(spendAmount || 0)) {
      await contract.methods
        .approve(
          delegateAddress,
          unlimited ? new BigNumber(2).pow(256).minus(1).toFixed() : userBalance
        )
        .send({ from: userAddy });
    }
  },

  async genericErc721Approval({ state }, { tokenAddress, delegateAddress }) {
    const userAddy = state.web3.address;
    const contract = ERC721(state.web3.instance, tokenAddress);
    // const tokenIdOwner = await contract.methods.ownerOf(tokenId).call();
    const isApproved = await contract.methods
      .isApprovedForAll(userAddy, delegateAddress)
      .call();
    if (isApproved) return;
    await contract.methods
      .setApprovalForAll(delegateAddress, true)
      .send({ from: userAddy });
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
      address: tokenAddy,
      name,
      symbol,
      decimals,
      userBalance,
    };
  },

  async getErc721TokenInfo({ state }, tokenAddy) {
    const userAddy = state.web3.address;
    const contract = ERC721(state.web3.instance, tokenAddy);
    const [name, symbol, userBalance] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.balanceOf(userAddy).call(),
    ]);
    return {
      address: tokenAddy,
      name,
      symbol,
      userBalance,
    };
  },
};
