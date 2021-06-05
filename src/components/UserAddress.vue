<template lang="pug">
span
  span.pl-1(v-if="userAddress")
    | {{ shortAddy }}
    button.btn-sm.close.m-0(v-loading="globalLoading", :disabled="globalLoading" @click="disconnect")
      i.now-ui-icons.ui-1_simple-remove
  button.btn.btn-round.m-0(v-else, v-loading="globalLoading", :disabled="globalLoading", @click="reconnect") Connect to your Wallet
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UserAddress",

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      userAddress: (state) => state.web3.address,
    }),

    shortAddy() {
      const f3 = this.userAddress.slice(0, 6);
      const l3 = this.userAddress.slice(-7, -1);
      return `${f3}...${l3}`;
    },
  },

  methods: {
    disconnect() {
      this.$store.dispatch("disconnect");
    },

    async reconnect() {
      await this.$store.dispatch("init", true);
    },
  },
};
</script>
<style scoped>
button {
  padding: 9px 18px;
}
</style>
