<template lang="pug">
div.m-2.text-white.text-center.small 1 MTGY = ${{ mtgyPriceUsd }} USD
</template>
<script>
import { mapState } from "vuex";
import BigNumber from "bignumber.js";

export default {
  computed: {
    ...mapState({
      mtgyPriceUsd: (state) => new BigNumber(state.mtgyPriceUsd).toFixed(6),
    }),
  },
};
</script>
