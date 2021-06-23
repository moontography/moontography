export default {
  SET_FAAS_POOL_CREATION_COST(state, cost) {
    state.faas.cost = cost;
  },

  SET_FAAS_USER_STAKING_CONTRACTS(state, pools) {
    state.faas.userPools = pools;
  },

  SETT_FAAS_STAKING_CONTRACTS(state, contracts) {
    state.faas.tokenStakingContracts = contracts;
  },
};
