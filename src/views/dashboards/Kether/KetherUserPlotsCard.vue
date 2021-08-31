<template lang="pug">
card
  div.d-block.d-md-flex.align-items-center
    h4.m-0.card-title
      | Thousand Ether Plots
    div.ml-auto.d-block.d-md-flex.align-items-center
      fg-input.mb-0(
        v-model="searchQuery"
        type="text"
        placeholder="Search for width, height, area, etc.")
      el-select.ml-1.select-primary(
        placeholder='Filter Plots'
        v-model='plotsFilter')
          el-option.select-primary(
            v-for='option in plotOptions'
            :value='option.value'
            :label='option.label'
            :key='option.label')
card.b-4(v-if="selectedPlots.length === 0")
  div
    i No plots yet with the filters selected!
div.row(v-else)
  div.col-md-6(v-for="plot in selectedPlots")
    user-plot-card(:plot="plot")
</template>
<script>
import { mapState } from "vuex";
import BigNumber from "bignumber.js";
import UserPlotCard from "./UserPlotCard";

export default {
  components: { UserPlotCard },

  data() {
    return {
      plotsFilter: "user",
      plotOptions: [
        { value: "all", label: "All plots" },
        { value: "loanable", label: "Loanable plots" },
        { value: "user", label: "Only your plots" },
      ],
      searchQuery: null,
    };
  },

  computed: {
    ...mapState({
      plotInfo: (state) => state.kether.plotInfo,
      userAddy: (state) => state.web3.address,
    }),

    selectedPlots() {
      let plots = this.allPlots.slice();
      switch (this.plotsFilter) {
        case "user":
          plots = this.yourPlots.slice();
          break;
        case "loanable":
          plots = this.loanablePlots.slice();
          break;
      }
      if (!this.searchQuery) return plots;

      const query = this.searchQuery.toLowerCase();
      return plots.filter((plot) => {
        return (
          plot.index.toString().includes(query) ||
          plot.x.toString().includes(query) ||
          plot.y.toString().includes(query) ||
          (plot.width * 10).toString().includes(query) ||
          (plot.height * 10).toString().includes(query) ||
          `${plot.height * 10}x${plot.width * 10}`.includes(query) ||
          new BigNumber(plot.width)
            .times(10)
            .times(plot.height)
            .times(10)
            .toFixed()
            .includes(query) ||
          plot.actualOwner.toLowerCase().includes(query)
        );
      });
    },

    allPlots() {
      return this.plotInfo.slice();
    },

    loanablePlots() {
      return this.plotInfo.filter((plot) => plot.isLoanable);
    },

    yourPlots() {
      return this.plotInfo.filter(
        (plot) => plot.actualOwner.toLowerCase() === this.userAddy.toLowerCase()
      );
    },
  },

  created() {
    if (this.yourPlots.length === 0) this.plotsFilter = "all";
  },
};
</script>
