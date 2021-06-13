<template lang="pug">
div.panel-header
  //- canvas(:id="headerChartId")
</template>

<script>
import headerChart from "./HeaderChart";

export default {
  name: "overview-header",
  data() {
    return {
      headerChartId: "headerChart",
    };
  },
  mounted() {
    // headerChart.createChart(this.headerChartId);
  },
};
</script>

<style scoped>
.panel-header {
  padding-bottom: 45px;
}
</style>
