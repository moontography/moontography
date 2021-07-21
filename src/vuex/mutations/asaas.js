export default {
  SET_ASAAS_COSTS(state, { mtgyServiceCost, gas }) {
    state.asaas.createSwapCost = mtgyServiceCost;
    state.asaas.gas = gas;
  },

  SET_ASAAS_INSTANCE_GAS_COST(state, { contractAddress, instanceGasCost }) {
    state.asaas.instanceGasCost = {
      ...state.asaas.instanceGasCost,
      [contractAddress]: instanceGasCost,
    };
  },

  SET_ASAAS_INSTANCE_SERVICE_COST(state, serviceCost) {
    state.asaas.instanceServiceCost = serviceCost;
  },

  SET_ASAAS_SWAPS(state, contracts) {
    state.asaas.swaps = contracts;
  },
};
