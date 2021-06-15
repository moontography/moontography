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
};
