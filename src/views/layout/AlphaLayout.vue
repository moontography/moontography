<template lang="pug">
div
  loading-panel(v-if="isLoadingLocal")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
  card(v-else)
    div HEREEEEE
    div.mt-2
      n-button(
        type="primary"
        @click="signMsg") Sign Message
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { isLoadingLocal: false };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      isConnected: (_, getters) => getters.isConnected,
    }),
  },

  methods: {
    async signMsg() {
      const info = await this.$store.dispatch(
        "signAndValidateMsg",
        "alpha as a service"
      );
      console.log("INFO", info);
    },
  },
};
</script>
