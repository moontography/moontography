<template lang="pug">
div
  loading-panel(v-if="isLoadingLocal")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected || !hasRafflerContract")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
    div.mx-auto(v-else-if="!hasRafflerContract")
      | Raffler/Lottery is not enabled for the network you're connected to.
      | Please connect to a supported network or contact an administrator
      | for more information.
  router-view(v-else)
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { isLoadingLocal: true };
  },

  computed: {
    ...mapState({
      isConnected: (_, getters) => getters.isConnected,
      hasRafflerContract: (_, getters) =>
        getters.activeNetwork && getters.activeNetwork.contracts.raffler,
    }),
  },

  async created() {
    try {
      await this.$store.dispatch("initRaffler");
    } finally {
      this.isLoadingLocal = false;
    }
  },
};
</script>
