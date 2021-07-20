<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Atomic Swap as a Service
    p.category
      div Provides a way to seamlessly swap pegged tokens across blockchains.
    n-button(
      type='primary'
      round=''
      data-toggle="modal"
      data-target="#create-swap-modal") Create Atomic Swap Bridge for your Token

create-swap-modal#create-swap-modal
</template>

<script>
import CreateSwapModal from "../dashboards/ASaaS/CreateSwapModal";
export default {
  components: {
    CreateSwapModal,
  },
};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
