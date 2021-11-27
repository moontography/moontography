<template lang="pug">
.row
  .col-md-12.mx-auto
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
    loading-panel(v-else-if="globalLoading")

    div.row(v-else)
      card.card-pricing(no-footer-line='')
        .row
          .col-md-3
            ul.mb-0
              li
                div
                  strong Current MTGY Balance
                div {{ walletMtgyBalance }} MTGY
                div
                  strong
                div ${{ walletUsdValue }} USD
          .col-md-3.d-flex.align-items-center
            ul.mb-0
              li
                div
                  b
                    i.now-ui-icons.arrows-1_minimal-right
                    i.now-ui-icons.arrows-1_minimal-right
          .col-md-3
            ul.mb-0
              li
                div
                  strong Resulting OKLG Balance
                div {{ oklgBalanceFormatted }} OKLG
                div
                  strong
                div ${{ oklgUsdValue }} USD
          .col-md-3  
            ul.mb-0
              li
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
export default {
  props: {
    swap: { type: Object },
  },

  data() {
    return {
      localError: null,
    };
  },

  watch: {
    activeNetwork: {
      async handler(newNet) {
        try {
          if (newNet) {
            await this.$store.dispatch("init");
            await this.$store.dispatch("getMtgyOklgRatio");
          }
        } catch (err) {
          this.$toast.error(err.message);
        }
      },
      deep: true,
    },
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      networks: (state) => state.eth.networks,
      web3: (state) => state.web3.instance,

      mtgyPrice: (state) => state.mtgyPriceUsd,
      userMtgyBalance: (state) => state.web3.userMtgyBalance,

      mtgyOklgRatio: (state) => state.mtgyOklgRatio,
      oklgPrice: (state) => state.oklgPriceUsd,
    }),

    walletMtgyBalance() {
      return new BigNumber(this.userMtgyBalance || 0).toFormat(
        2,
        BigNumber.ROUND_DOWN
      );
    },

    walletUsdValue() {
      return new BigNumber(this.mtgyPrice)
        .times(this.userMtgyBalance || 0)
        .toFormat(2, BigNumber.ROUND_DOWN);
    },

    oklgBalance() {
      return (this.userMtgyBalance || 0) * this.mtgyOklgRatio;
    },

    oklgBalanceFormatted() {
      return new BigNumber(this.oklgBalance).toFormat(2, BigNumber.ROUND_DOWN);
    },

    oklgUsdValue() {
      return new BigNumber(this.oklgPrice)
        .times(this.oklgBalance)
        .toFormat(2, BigNumber.ROUND_DOWN);
    },
  },

  methods: {
    async swapMtgyForOklg() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("swapMtgyForOklg");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async mounted() {
    try {
      this.$store.commit("SET_GLOBAL_LOADING", true);
      await this.$store.dispatch("getMtgyOklgRatio");
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.$store.commit("SET_GLOBAL_LOADING", false);
    }
  },
};
</script>
