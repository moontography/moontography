<template>
  <div class="row" v-loading="true" id="loading"></div>
</template>
<script>
export default {};
</script>
<style>
#loading {
  min-height: 200px;
  display: flex;
  align-items: center;
}
.el-loading-spinner .path {
  stroke: #66615b !important;
}
.el-loading-mask {
  background: transparent !important;
}
</style>
