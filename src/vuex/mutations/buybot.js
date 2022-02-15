export default {
  SET_BUYBOT_BOTS(state, bots) {
    state.buybot.bots = bots;
  },

  SET_BUYBOT_DAILY_COST(state, cost) {
    state.buybot.dailyCost = cost;
  },
};
