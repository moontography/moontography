import trustedTimestamping from "./trustedTimestamping";

export default {
  ...trustedTimestamping,

  SET_GLOBAL_ERROR(state, error) {
    state.globalError = error;
  },

  SET_GLOBAL_LOADING(state, isLoading) {
    state.globalLoading = isLoading;
  },

  SET_MTGY_PRICE_USD(state, price) {
    state.mtgyPriceUsd = price;
  },

  SET_WEB3_IS_CONNECTED(state, isConnected) {
    state.web3.isConnected = isConnected;
  },

  SET_WEB3_IS_APPROVED(state, isApproved) {
    state.web3.isApproved = isApproved;
  },

  SET_WEB3_CHAIN_ID(state, chainId) {
    state.web3.chainId = chainId;
  },

  SET_WEB3_INSTANCE(state, web3) {
    state.web3.instance = web3;
  },

  SET_WEB3_USER_ADDRESS(state, addy) {
    state.web3.address = addy;
  },

  SET_WEB3_MAIN_BALANCE(state, balance) {
    state.web3.mainCurrencyBalance = balance;
  },
};
