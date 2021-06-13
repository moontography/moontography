<template lang="pug">
div
  div.d-flex.align-items-center.pl-1.user-address-trunc(v-if="userAddress")
    //- div.mr-2 #[img(style ="max-height: 20px" :src="activeNetworkLogo")]
    div
      div {{ shortAddy }}
      div {{ userMtgyBalance }} MTGY
    div.ml-auto
      button.btn-sm.close.py-0.m-0(
        v-loading="globalLoading"
        :disabled="globalLoading"
        @click="disconnect")
          i.pl-2.now-ui-icons.ui-1_simple-remove
  button.btn.btn-round.btn-danger.m-0(
    v-else
    v-loading="globalLoading"
    :disabled="globalLoading"
    @click="reconnect") Connect to your Wallet
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";

export default {
  name: "UserAddress",

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      // activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      userAddress: (state) => state.web3.address,
      userMtgyBalance: (state) =>
        new BigNumber(state.web3.userMtgyBalance).toFixed(2),
    }),

    shortAddy() {
      const f3 = this.userAddress.slice(0, 6);
      const l3 = this.userAddress.slice(-4);
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

.user-address-trunc {
  text-transform: initial;
}
</style>
