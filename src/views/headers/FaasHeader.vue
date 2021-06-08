<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Farming as a Service {{ tokenAddress ? `- ${tokenAddress}` : '' }}
    p.category
      div Provide farming for any contract address.
      div
        | #[router-link(to="/faas/owner") Click Here] if you are a project owner who
        | wants to put up tokens for others to stake.
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
