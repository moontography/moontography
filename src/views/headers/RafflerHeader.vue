<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Raffler
    p.category
      | Create raffles and lottery drawings for ERC-20 or ERC-721 (NFT) tokens.
    //- div
    //-   router-link(to="/raffler/new")
    //-     n-button(
    //-       type='primary'
    //-       round='') Create New Raffle/Lottery
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      // initLoading: (state) => state.initLoading,
    }),
  },
};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
