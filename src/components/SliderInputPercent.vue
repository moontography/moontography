<template lang="pug">
div.row.small-gutters
  div(:class="maxAmount ? 'col-md-6' : 'col-md-7'")
    slider(
      v-model="mutableModel"
      @update:modelValue="updateModel()")
  div.col-md-2(v-if="maxAmount")
    fg-input(
      v-if="maxAmount"
      type="number"
      v-model="mutableExact"
      @update:modelValue="updateExact()")
  div.col-md
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
import BigNumber from "bignumber.js";

export default {
  emits: ["update:modelValue"],
  props: {
    modelValue: [Number, String],
    maxAmount: [Number, String],
  },
  data() {
    return {
      mutableModel: this.modelValue || 0,
      mutableExact:
        this.modelValue && this.maxAmount
          ? new BigNumber(this.modelValue).div(100).times(this.maxAmount)
          : 0,
    };
  },
  watch: {
    modelValue(newVal) {
      this.mutableModel = newVal;
    },
  },
  methods: {
    updateExact(exactAmount = this.mutableExact, updateModel = true) {
      if (!this.maxAmount) return;
      this.mutableExact = exactAmount;

      if (updateModel) {
        if (!exactAmount) return this.updateModel(0, false);

        if (new BigNumber(exactAmount).gt(this.maxAmount))
          return this.updateModel(100, false);

        this.updateModel(
          new BigNumber(exactAmount).div(this.maxAmount).times(100).toFixed(),
          false
        );
      }
    },

    updateModel(newVal = this.mutableModel, updateExact = true) {
      newVal = new BigNumber(newVal).gte(100)
        ? 100
        : newVal || this.mutableModel || 0;
      if (updateExact && this.maxAmount) {
        this.updateExact(
          newVal
            ? new BigNumber(newVal).div(100).times(this.maxAmount).toFixed()
            : 0,
          false
        );
      }
      this.$emit("update:modelValue", newVal);
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
