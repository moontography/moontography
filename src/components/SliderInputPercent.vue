<template lang="pug">
div.row.small-gutters
  div.col-md-7
    slider(
      v-model="mutableModel"
      @update:modelValue="updateModel()")
  div.col-md-3
    fg-input(
      addon-right-icon="fa fa-percent"
      v-model="mutableModel"
      @update:modelValue="updateModel()")
  div.col-md-2
    n-button.m-0.skinny-btn.w-100(
      type="primary"
      round
      @click="updateModel(100)")
        span MAX
</template>
<script>
export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: [Number, String],
  },
  data() {
    return {
      mutableModel: this.modelValue || 0,
    };
  },
  watch: {
    modelValue(newVal) {
      this.mutableModel = newVal;
    },
  },
  methods: {
    updateModel(newVal = null) {
      this.$emit("update:modelValue", newVal || this.mutableModel);
    },
  },
  created() {
    this.mutableModel = this.modelValue;
  },
};
</script>
<style lang="scss">
.skinny-btn {
  padding-left: 11px !important;
  padding-right: 11px !important;
}

.small-gutters {
  margin-right: -7px;
  margin-left: -7px;

  > .col,
  > [class*="col-"] {
    padding-right: 7px;
    padding-left: 7px;
  }
}
</style>
