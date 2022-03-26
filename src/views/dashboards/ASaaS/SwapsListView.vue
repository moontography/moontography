<template lang="pug">
.row
  .col-md-12.mx-auto
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
    loading-panel(v-else-if="localLoading")
    div.row(v-else-if="swaps.length === 0")
      div.col-xl-8.mx-auto
        card
          h4.m-0.text-center.py-4
            | #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]
            | There are no active atomic swaps setup in {{ activeNetwork.name }}
            | yet #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]

    div.row(v-else)
      template(v-for="swap in swaps")
        .col-lg-4(v-if="shouldShowCard(swap)")
          swap-card(:swap="swap")
</template>
<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import SwapCard from "./SwapCard";

export default {
  components: { SwapCard },

  data() {
    return {
      localError: null,
      localLoading: true,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      userAddy: (state) => state.web3.address,
      swaps: (state) => state.asaas.swaps,
    }),

    isAtomicSwapSupported() {
      return (
        this.activeNetwork.contracts && this.activeNetwork.contracts.atomicSwap
      );
    },
  },

  watch: {
    activeNetwork: {
      async handler(newNet) {
        try {
          this.localLoading = true;
          if (newNet) {
            await this.$store.dispatch("getAllSwapContracts");
          }
        } finally {
          this.localLoading = false;
        }
      },
      deep: true,
    },
  },

  methods: {
    isTargetZero(addy) {
      return new BigNumber(addy).eq(0);
    },

    shouldShowCard(swap) {
      const disabled = [
        "0x1a57121A855b5043176Fcf4EeC78e35282eF090C",
        "0x3298ad5853968e40751dEa61707635773D340D6b",
      ];
      return (
        (!this.isTargetZero(swap.targetContract) ||
          swap.creator == this.userAddy) &&
        !disabled.includes(swap.sourceContract) &&
        !disabled.includes(swap.targetContract)
      );
    },
  },

  async mounted() {
    try {
      if (!this.isAtomicSwapSupported) {
        throw new Error(
          `Atomic swapping is not supported in ${
            this.activeNetwork.name || "this network"
          } yet.`
        );
      }

      await this.$store.dispatch("getAllSwapContracts");
    } catch (err) {
      this.localError = err;
    } finally {
      this.localLoading = false;
    }
  },
};
</script>
