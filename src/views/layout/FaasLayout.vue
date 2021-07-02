<template lang="pug">
div
  loading-panel(v-if="isInitLoading")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected || !hasFaasContract")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
    div.mx-auto(v-else-if="!hasFaasContract")
      | Farming as a Service is not enabled for the network you're connected to.
      | Please connect to a supported network or contact an administrator
      | for more information.
  router-view(v-else)

  disclaimer-modal#disclaimer-modal(
    @confirm="confirmDisclaimer"
  )
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
import DisclaimerModal from "@/components/DisclaimerModal";

export default {
  components: {
    DisclaimerModal,
  },

  computed: mapState({
    isInitLoading: (state) => state.initLoading,
    isConnected: (_, getters) => getters.isConnected,
    hasFaasContract: (_, getters) =>
      getters.activeNetwork && getters.activeNetwork.contracts.faas,
  }),

  methods: {
    confirmDisclaimer() {
      localStorage.faasDisclaimerAcknowlegded = true;
    },
  },

  mounted() {
    if (!localStorage.faasDisclaimerAcknowlegded)
      $(`#disclaimer-modal`).modal("show");
  },
};
</script>
