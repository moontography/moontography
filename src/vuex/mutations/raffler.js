export default {
  SET_RAFFLER_COSTS(state, { serviceCost, entryFeePercentageCharge }) {
    state.raffler.createRaffleCost = serviceCost;
    state.raffler.entryFeePercentageCharge = entryFeePercentageCharge;
  },

  SET_ALL_RAFFLE_IDS(state, raffleIds) {
    state.raffler.allRaffleIds = raffleIds;
  },

  SET_RAFFLE_INFO(state, { id, info }) {
    state.raffler.raffleInfo = {
      ...state.raffler.raffleInfo,
      [id]: info,
    };
  },
};
