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
      this.populateChart();
    },
  },

  computed: {
    ...mapState({
      chartData: (state) => state.platformTokenChart,
    }),
  },

  methods: {
    populateChart() {
      try {
        headerChart.createChart(this.chartId, this.chartData);
      } catch (err) {
        true;
      }
    },
  },

  mounted() {
    this.populateChart();
  },
};
</script>

<style scoped>
.panel-header {
  padding-bottom: 45px;
}
</style>
