import airdropper from "./airdropper";
import alpha from "./alpha";
import asaas from "./asaas";
import buybot from "./buybot";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import raffler from "./raffler";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...airdropper,
  ...alpha,
  ...asaas,
  ...buybot,
  ...faas,
  ...kether,
  ...passwordManager,
  ...raffler,
  ...trustedTimestamping,

  SET_GLOBAL_ERROR(state, error) {
    state.globalError = error;
  },

  SET_GLOBAL_LOADING(state, isLoading) {
    state.globalLoading = isLoading;
  },

  SET_INIT_LOADING(state, isLoading) {
    state.initLoading = isLoading;
  },

  SET_INIT_FINISHED(state, isFinished) {
    state.initFinished = isFinished;
  },

  SET_ROUTE(state, to) {
    state.route = to;
  },

  SET_SELECTED_ADDRESS(state, address) {
    state.selectedAddressInfo.address = address;
  },

  SET_SELECTED_ADDRESS_INFO(state, info) {
    const keys = Object.keys(info);
    state.selectedAddressInfo = {
      ...state.selectedAddressInfo,
      ...keys.reduce((o, key) => ({ ...o, [key]: info[key] }), {}),
    };
  },

  SET_TOKEN_CIRC_SUPPLY(state, supply) {
    state.tokenCircSupply = supply;
  },

  SET_TOKEN_TOT_SUPPLY(state, supply) {
    state.tokenTotSupply = supply;
  },

  SET_TOKEN_INFO(state, info) {
    state.platformTokenInfo = info;
  },

  SET_TOKEN_CHART(state, prices) {
    state.platformTokenChart = prices;
  },

  SET_WEB3_IS_CONNECTED(state, isConnected) {
    state.web3.isConnected = isConnected;
  },

  SET_WEB3_CHAIN_ID(state, chainId) {
    state.web3.chainId = chainId;
  },

  SET_WEB3_INSTANCE(state, web3) {
    state.web3.instance = web3;
  },

  SET_WEB3_PROVIDER(state, provider) {
    state.web3.provider = provider;
  },

  SET_WEB3_USER_ADDRESS(state, addy) {
    state.web3.address = addy;
  },

  SET_WEB3_USER_TOKEN_BALANCE(state, balance) {
    state.web3.userTokenBalance = balance;
  },

  SET_WEB3_MAIN_BALANCE(state, balance) {
    state.web3.mainCurrencyBalance = balance;
  },

  SET_CURRENT_BLOCK(state, block) {
    state.currentBlock = block;
  },

  SET_OKLG_PRICE_USD(state, price) {
    state.oklgPriceUsd = price;
  },

  SET_MTGY_OKLG_RATIO(state, ratio) {
    state.mtgyOklgRatio = ratio;
  },
};
