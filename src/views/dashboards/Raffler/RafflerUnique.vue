<template lang="pug">
div.row
  div.col-md-6.offset-md-3.col-lg-4.offset-md-4
    raffle-card(:raffle-id="raffleId")
</template>

<script>
// import { mapState } from "vuex";
import RaffleCard from "./RaffleCard";

export default {
  components: {
    RaffleCard,
  },
  props: {
    raffleId: { type: String, default: null },
  },
};
</script>
