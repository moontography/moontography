<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Farming as a Service {{ tokenAddress ? `- ${tokenAddress}` : '' }}
    p.category
      div Put up tokens to be farmed/staked by others or farm and earn tokens for any contract address.
    p
      a.text-white(href="https://app.oklg.io")
        u Click Here Create Staking Pool for your Token
      //- div.mt-4
      //-   div(v-if="$route.path !== '/faas/owner'")
      //-     | #[router-link(to="/faas/owner") #[i.fa.fa-exclamation-circle] Click here] if you are a 
      //-     | project owner who wants to put up tokens for others to stake.
      //-   div(v-else)
      //-     | Create your own pools for users to stake and be rewarded with tokens that you choose!
      //-     div #[router-link(to="/faas/staker") #[i.fa.fa-exclamation-circle] Click here] to go back to farms.
</template>

<script>
export default {
  props: {
    tokenAddress: { type: String, default: null },
  },
};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
