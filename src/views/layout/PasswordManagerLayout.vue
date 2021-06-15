<template lang="pug">
div
  loading-panel(v-if="isInitLoading")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected || !hasPasswordManagerContract")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
    div.mx-auto(v-else-if="!hasPasswordManagerContract")
      | Password Manager is not enabled for the network you're connected to.
      | Please connect to a supported network or contact an administrator
      | for more information.
  router-view(v-else)
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState({
    isInitLoading: (state) => state.initLoading,
    isConnected: (_, getters) => getters.isConnected,
    hasPasswordManagerContract: (_, getters) =>
      getters.activeNetwork && getters.activeNetwork.contracts.passwordManager,
  }),
};
</script>
