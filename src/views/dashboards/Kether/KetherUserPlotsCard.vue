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
        v-model="plotsFilter"
        @change="pagination.currentPage = 1")
          el-option.select-primary(
            v-for='option in plotOptions'
            :value='option.value'
            :label='option.label'
            :key='option.label')
card.b-4(v-if="pagedData.length === 0")
  div
    i No plots yet with the filters selected!
div.row(v-else)
  div.col-12.d-flex.align-items-center.justify-content-center.justify-content-sm-between.flex-wrap
    div
      p.card-category
        | Showing {{ from + 1 }} to {{ to }} of {{ total }} plots
    n-pagination.pagination-no-border(
      v-model='pagination.currentPage'
      :per-page='pagination.perPage'
      :total='total')

  div.col-md-6(v-for="plot in pagedData")
    user-plot-card(:plot="plot")

  div.col-12.d-flex.align-items-center.justify-content-center.justify-content-sm-between.flex-wrap
    div
      p.card-category
        | Showing {{ from + 1 }} to {{ to }} of {{ total }} plots
    n-pagination.pagination-no-border(
      v-model='pagination.currentPage'
      :per-page='pagination.perPage'
      :total='total')
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
        { value: "loaning", label: "Plots you're lending" },
        { value: "user", label: "Plots you own" },
      ],
      searchQuery: null,

      pagination: {
        perPage: 50,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0,
      },
    };
  },

  computed: {
    ...mapState({
      plotInfo: (state) => state.kether.plotInfo || [],
      userAddy: (state) => state.web3.address,
    }),

    pagedData() {
      return (this.selectedPlots || []).slice(this.from, this.to);
    },

    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },

    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },

    total() {
      return (this.selectedPlots || []).length > 0
        ? (this.selectedPlots || []).length
        : (this.plotInfo || []).length;
    },

    selectedPlots() {
      let plots = this.plotInfo.slice();
      switch (this.plotsFilter) {
        case "user":
          plots = this.yourPlots.slice();
          break;
        case "loaning":
          plots = this.plotsYourLending.slice();
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

    loanablePlots() {
      return this.plotInfo.filter((plot) => plot.isLoanable);
    },

    plotsYourLending() {
      return this.loanablePlots.filter(
        (plot) =>
          plot.loanInfo &&
          plot.loanInfo.loaner.toLowerCase() === this.userAddy.toLowerCase()
      );
    },

    yourPlots() {
      return this.plotInfo.filter(
        (plot) => plot.actualOwner.toLowerCase() === this.userAddy.toLowerCase()
      );
    },
  },

  created() {
    if (this.yourPlots.length === 0) {
      if (this.plotsYourLending.length > 0)
        return (this.plotsFilter = "loaning");
      if (this.loanablePlots.length > 0) return (this.plotsFilter = "loanable");
      this.plotsFilter = "all";
    }
  },
};
</script>
