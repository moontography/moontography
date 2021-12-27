<template lang="pug">
.row
  .col-lg-6.mx-auto
    loading-panel(v-if="!initFinished")

    div.alert.alert-danger(v-else-if="localError")
      | {{ localError.message }}

    div.alert.alert-danger.text-center(v-else-if="activeNetwork.short_name != 'bsc'")
      div This swap is only supported on Binance Smart Chain (BSC).

    div.row(v-else)
      card.card-pricing.d-flex.flex-column.align-items-center(no-footer-line='')
        div.mb-4
          div.small
            small Swap Contract: {{ oklgSwapContract }}
          h2 Swap your MTGY for OKLG
          div.small
            div.mb-3
              | This interface provides a one way migration for your your current MTGY over to
              | OKLG, which will serve as the new utility token for the OKLG ecosystem.
            div.mb-3
              i
                | NOTE: there is currently liquidity on Pancakeswap (BSC) for the MTGY/BNB pair that you
                | can use to trade your MTGY. This liquidity however will be removed in the near future and
                | provided for the OKLG token.
            div.text-danger
              strong It's highly recommended to swap your MTGY for OKLG as soon as possible here.
        div.mb-5
          h3.m-0.text-primary Your MTGY Balance
          div {{ walletMtgyBalance }} MTGY
          div ${{ walletUsdValue }} USD
        div.mb-5
          h3.m-0.text-primary OKLG You Will Swap For
          div {{ oklgBeingSwappedForFormatted }} OKLG
          div ${{ oklgUsdValue }} USD
        div
          n-button(
            :disabled="globalLoading"
            v-loading="globalLoading"
            type='success'
            round=''
            @click="swapMtgyForOklg") Swap MTGY for OKLG

</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import sleep from "../../factories/Sleep";
export default {
  props: {
    swap: { type: Object },
  },

  data() {
    return {
      localError: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      initFinished: (state) => state.initFinished,
      networks: (state) => state.eth.networks,
      web3: (state) => state.web3.instance,
      oklgSwapContract: (_, getters) =>
        getters.activeNetwork && getters.activeNetwork.contracts.mtgyOklgSwap,

      mtgyPrice: (state) => state.mtgyPriceUsd,
      userMtgyBalance: (state) => state.web3.userMtgyBalance,

      mtgyOklgRatio: (state) => state.mtgyOklgRatio,
      oklgPrice: (state) => state.oklgPriceUsd,
    }),

    walletMtgyBalance() {
      return new BigNumber(this.userMtgyBalance || 0).toFormat();
    },

    walletUsdValue() {
      return new BigNumber(this.mtgyPrice)
        .times(this.userMtgyBalance || 0)
        .toFormat(2, BigNumber.ROUND_DOWN);
    },

    oklgBeginSwappedFor() {
      return new BigNumber(this.userMtgyBalance || 0)
        .times(this.mtgyOklgRatio)
        .toFixed();
    },

    oklgBeingSwappedForFormatted() {
      return new BigNumber(this.oklgBeginSwappedFor).toFormat();
    },

    oklgUsdValue() {
      return new BigNumber(this.oklgPrice)
        .times(this.oklgBeginSwappedFor)
        .toFormat(2, BigNumber.ROUND_DOWN);
    },
  },

  methods: {
    async swapMtgyForOklg() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("swapMtgyForOklg");
        await this.$store.dispatch("init");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async getRatio() {
      try {
        if (!this.initFinished) {
          await sleep(1000);
          await this.getRatio();
        }
        await this.$store.dispatch("getMtgyOklgRatio");
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
  },

  async created() {
    await this.getRatio();
  },
};
</script>
