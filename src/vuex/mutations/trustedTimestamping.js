export default {
  SET_TRUSTED_TIMESTAMPING_COST(state, cost) {
    state.trustedTimestamping.cost = cost;
  },

  SET_TRUSTED_TIMESTAMPING_XLM_SECRET_SEED(state, seed) {
    state.trustedTimestamping.xlm.xlmSecretSeed = seed;
  },

  SET_TRUSTED_TIMESTAMPING_HASHES(state, hashes) {
    state.trustedTimestamping.hashes = hashes;
  },
};
