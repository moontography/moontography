export default {
  activeNetwork(state) {
    return state.eth.networks.find((n) => n.chain_id === state.web3.chainId);
  },
};
