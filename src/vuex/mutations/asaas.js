export default {
  SET_ASAAS_COSTS(state, { serviceCost, gas }) {
    state.asaas.createSwapCost = serviceCost;
    state.asaas.gas = gas;
  },

  SET_ASAAS_INSTANCE_GAS_COST(state, { contractAddress, instanceGasCost }) {
    state.asaas.instanceGasCost = {
      ...state.asaas.instanceGasCost,
      [contractAddress]: instanceGasCost,
    };
  },

  SET_ASAAS_INSTANCE_SERVICE_COST(state, { contractAddress, serviceCost }) {
    state.asaas.instanceServiceCost = {
      ...state.asaas.instanceServiceCost,
      [contractAddress]: serviceCost,
    };
  },

  SET_ASAAS_SWAPS(state, contracts) {
    state.asaas.swaps = contracts;
  },
};
