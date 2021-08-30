<template lang="pug">
card
  h2.m-0 Your Plots
card.b-4(v-if="yourPlots.length === 0")
  template(v-slot:header='')
    h4.card-title
      | Your Plots
  div
    i You don't have any plots!
div.row(v-else)
  div.col-6.text-center(v-for="plot in yourPlots")
    user-plot-card(:plot="plot")
</template>
<script>
import { mapState } from "vuex";
import UserPlotCard from "./UserPlotCard";

export default {
  components: { UserPlotCard },

  computed: {
    ...mapState({
      plotInfo: (state) => state.kether.plotInfo,
      userAddy: (state) => state.web3.address,
    }),

    yourPlots() {
      return this.plotInfo
        .map((plot, index) => {
          return { ...plot, index };
        })
        .filter(
          (plot) =>
            plot.actualOwner.toLowerCase() === this.userAddy.toLowerCase()
        );
    },
  },
};
</script>
