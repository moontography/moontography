<template lang="pug">
div.m-2.text-white.text-center
  div.mb-2.d-flex.align-items-center.justify-content-center
    a.mr-2.text-white(
      title="Website"
      href="https://moontography.com"
      target="_blank"
      rel="noopener noreferrer")
        i.fa.fa-2x.fa-globe
    a.mr-2.text-white(
      title="Telegram"
      href="https://t.me/moontographyproject"
      target="_blank"
      rel="noopener noreferrer")
        i.fa.fa-2x.fa-telegram
    a.mr-2.text-white(
      title="Blog"
      href="https://blog.moontography.com"
      target="_blank"
      rel="noopener noreferrer")
        i.fa.fa-2x.fa-medium
    a.text-white(
      title="GitHub"
      href="https://github.com/moontography"
      target="_blank"
      rel="noopener noreferrer")
        i.fa.fa-2x.fa-github

  div.small 1 MTGY = ${{ mtgyPriceUsd }} USD
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
