<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Buybot 🟢
    p.category
      | Setup a telegram buybot for your project to provide insights into
      | buys of your token that is listed on the most popular DEXs, Uniswap or Pancakeswap!
    p.text-center.mt-3
      router-link.text-white(to="/buybot/affiliates") Click here if you are an affiliate
</template>

<script>
export default {};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
