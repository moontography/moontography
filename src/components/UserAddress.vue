<template lang="pug">
div
  div.d-flex.align-items-center.pl-1.user-address-trunc(v-if="userAddress")
    //- div.mr-2 #[img(style ="max-height: 20px" :src="activeNetworkLogo")]
    div
      div {{ shortAddy }}
      div {{ walletTokenBalance }} OKLG 
      div ${{ walletUsdValue }} USD
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
      tokenPrice: (state) => state.oklgPriceUsd,
      userAddress: (state) => state.web3.address,
      userTokenBalance: (state) => state.web3.userTokenBalance,
    }),

    shortAddy() {
      const f3 = this.userAddress.slice(0, 6);
      const l3 = this.userAddress.slice(-4);
      return `${f3}...${l3}`;
    },

    walletTokenBalance() {
      return new BigNumber(this.userTokenBalance || 0).toFormat(
        2,
        BigNumber.ROUND_DOWN
      );
    },

    walletUsdValue() {
      return new BigNumber(this.tokenPrice)
        .times(this.userTokenBalance || 0)
        .toFormat(2, BigNumber.ROUND_DOWN);
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
