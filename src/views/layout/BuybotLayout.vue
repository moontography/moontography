<template lang="pug">
div
  loading-panel(v-if="isLoadingLocal")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
  div.row(v-else-if="!hasContract")
    div.col-xl-8.mx-auto
      card
        h4.m-0.text-center.py-4
          | #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]
          | The buybot service is not available yet in {{ activeNetwork.name }}.
          | #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]
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
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      isConnected: (_, getters) => getters.isConnected,
      hasContract: (_, getters) =>
        getters.activeNetwork && getters.activeNetwork.contracts.buybot,
    }),
  },

  async created() {
    try {
      await this.$store.dispatch("buybotInit");
    } finally {
      this.isLoadingLocal = false;
    }
  },
};
</script>
