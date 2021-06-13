<template lang="pug">
div.panel-header.panel-header-lg
  canvas(:id="chartId")
</template>

<script>
import { mapState } from "vuex";
import headerChart from "./HeaderChart";

export default {
  name: "overview-header",

  data() {
    return {
      chartId: "headerChart",
    };
  },

  watch: {
    chartData() {
      headerChart.createChart(this.chartId, this.chartData);
    },
  },

  computed: {
    ...mapState({
      chartData: (state) => state.mtgyChart,
    }),
  },

  mounted() {
    headerChart.createChart(this.chartId, this.chartData);
  },
};
</script>

<style scoped>
.panel-header {
  padding-bottom: 45px;
}
</style>
