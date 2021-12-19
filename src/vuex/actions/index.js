import airdropper from "./airdropper";
import asaas from "./asaas";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import raffler from "./raffler";
import trustedTimestamping from "./trustedTimestamping";

import axios from "axios";
import BigNumber from "bignumber.js";
import DexUtils from "../../factories/DexUtils";
import ExponentialBackoff from "../../factories/ExponentialBackoff";
import NftUtils from "../../factories/NftUtils";
import Web3Modal from "../../factories/web3/Web3Modal";
import ERC20 from "../../factories/web3/ERC20";
import ERC721 from "../../factories/web3/ERC721";
import OKLGSpend from "../../factories/web3/OKLGSpend";
import { useToast } from "vue-toastification";
import TokenDataUtils from "@/factories/TokenDataUtils";
const toast = useToast();

export default {
  ...airdropper,
  ...asaas,
  ...faas,
  ...kether,
  ...passwordManager,
  ...raffler,
  ...trustedTimestamping,

  async init({ commit, dispatch, getters, state }, reset = false) {
    try {
      commit("SET_INIT_LOADING", true);
      commit("SET_GLOBAL_ERROR", null);

      // an error with this API will break the app if we await, so don't here
      dispatch("getOklgPriceUsd");
      dispatch("getOklgPriceUsd");

      // Get MTGY info before having to connect wallet.
      // Allows dashboard data to be shown even if user does not connect wallet.

      await ExponentialBackoff(async () => {
        await Promise.all([
          dispatch("getMTGYCirculatingSupply"),
          dispatch("getMTGYTotalSupply"),
          dispatch("getOklgTokenInfo"),
          dispatch("getOklgTokenChart"),
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
      commit("SET_INIT_FINISHED", true);
    }
  },

  async getUserBalance({ commit, dispatch, getters }) {
    if (!getters.activeNetwork) return;
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
        dispatch("getOklgPriceUsd");
        dispatch("getOklgPriceUsd");

        await Promise.all([
          dispatch("getUserBalance"),
          dispatch("getMTGYCirculatingSupply"),
          dispatch("getMTGYTotalSupply"),
          dispatch("getOklgTokenInfo"),
          dispatch("getOklgTokenChart"),
          dispatch("getCurrentBlock"),
        ]);
      } catch (err) {
        console.error(`Error refreshing data`, err);
      }
    };
    // state.refreshableInterval = setInterval(go, 10000);
    // await go();
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

  async getCurrentBlock({ state, commit }) {
    const web3 = state.web3.instance;
    if (!web3) return;
    const block = await web3.eth.getBlockNumber();
    commit("SET_CURRENT_BLOCK", block);
  },

  async getOklgPriceUsd({ commit, getters }) {
    if (!getters.activeNetwork) return;
    const price = await DexUtils.getTokenPrice(
      getters.activeNetwork.contracts.mtgy
    );
    commit("SET_MTGY_PRICE_USD", price);
  },

  async getMTGYCirculatingSupply({ commit, state }, reset = false) {
    if (state.mtgyCircSupply != "0" && !reset) return;
    const supply = await TokenDataUtils.getCirculatingSupply();
    commit("SET_MTGY_CIRC_SUPPLY", supply);
  },

  async getMTGYTotalSupply({ commit, state }, reset = false) {
    if (state.mtgyTotSupply != "0" && !reset) return;
    const supply = await TokenDataUtils.getTotalSupply();
    commit("SET_MTGY_TOT_SUPPLY", supply);
  },

  async getOklgTokenInfo({ commit }) {
    const info = await TokenDataUtils.getTokenInfo("ok-lets-go");
    commit("SET_OKLG_TOKEN_INFO", info);
  },

  async getOklgTokenChart({ commit, state }, reset = false) {
    if (state.mtgyChart && state.mtgyChart.length > 0 && !reset) return;
    const prices = await TokenDataUtils.getTokenChart("ok-lets-go");
    commit("SET_OKLG_TOKEN_CHART", prices);
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

  async getUserOwnedNfts({ getters, state }, { tokenAddress, ownerAddress }) {
    const userAddy = state.web3.address;
    ownerAddress = ownerAddress || userAddy;

    const web3 = state.web3.instance;
    const moralisApiKey = state.moralisApiKey;
    const activeNetwork = getters.activeNetwork;
    const nftContract = ERC721(web3, tokenAddress);
    const nftUtils = NftUtils(moralisApiKey);
    const allUserTokens = await nftUtils.getNftsOwnedByUser(
      tokenAddress,
      ownerAddress,
      activeNetwork.short_name
    );
    const checkOwns = await Promise.all(
      Object.values(allUserTokens).map(async (token) => {
        const owns = await nftContract.methods.ownerOf(token.token_id).call();
        return owns.toLowerCase() === ownerAddress.toLowerCase() ? token : null;
      })
    );
    let ids = new Set();
    const ownedNfts = checkOwns.filter((t) => {
      if (!t) return false;
      if (ids.has(t.token_id)) return false;
      ids.add(t.token_id);
      return true;
    });

    return await Promise.all(
      ownedNfts.map(async (nft) => {
        let metadata = JSON.parse(nft.metadata || null);
        if (!metadata && nft.token_uri) {
          const { data } = await axios.get(
            nftUtils.fixTokenUriURL(nft.token_uri)
          );
          if (data.image) {
            metadata = {
              name: data.name,
              image: nftUtils.fixImageURL(data.image),
            };
          }
        }
        return {
          ...nft,
          nft_name: metadata ? metadata.name : "No name",
          image: metadata ? nftUtils.fixImageURL(metadata.image) : null,
        };
      })
    );
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

  async getProductCostWei({ getters, state }, { productID, productContract }) {
    const web3 = state.web3.instance;
    const spendCont = getters.activeNetwork.contracts.spend;
    const spend = OKLGSpend(web3, spendCont);
    const [defaultCostUSD, overrideCostUSD] = await Promise.all([
      spend.methods.defaultProductPriceUSD(productID).call(),
      spend.methods.overrideProductPriceUSD(productContract).call(),
    ]);
    const [defaultCostWei, overrideCostWei] = await Promise.all([
      spend.methods.getProductCostWei(defaultCostUSD).call(),
      spend.methods.getProductCostWei(overrideCostUSD).call(),
    ]);
    return new BigNumber(overrideCostWei).gt(0)
      ? overrideCostWei
      : defaultCostWei;
  },
};
