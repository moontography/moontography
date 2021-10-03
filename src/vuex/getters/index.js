export default {
  isConnected(state) {
    return state.web3.isConnected;
  },

  activeNetwork(state) {
    return state.eth.networks.find((n) => n.chain_id === state.web3.chainId);
  },

  activeNetworkLogo(_, getters) {
    try {
      return getters.activeNetwork.logo || `img/eth.png`;
    } catch (err) {
      return `img/eth.png`;
    }
  },

  activeNetworkExplorerUrl(_, getters) {
    try {
      return getters.activeNetwork.explorer_url;
    } catch (err) {
      return null;
    }
  },

  tokenRoute(_, getters) {
    return getters.activeNetworkExplorerUrl === "https://explorer.kcc.io/en"
      ? "tokentxns"
      : "token";
  },
};
