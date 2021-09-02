export default {
  SET_FAAS_POOL_CREATION_COST(state, cost) {
    state.faas.cost = cost;
  },

  SETT_FAAS_STAKING_CONTRACTS(state, contracts) {
    state.faas.tokenStakingContracts = contracts;
  },
};
