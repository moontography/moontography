<template lang="pug">
div.row
  div.col-md-9
    slider(
      v-model="mutableModel"
      @update:modelValue="updateModel")
  div.col-md-3
    fg-input(
      addon-right-icon="fa fa-percent"
      v-model="mutableModel"
      @update:modelValue="updateModel")
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
    updateModel(newVal) {
      this.$emit("update:modelValue", this.mutableModel);
    },
  },
  created() {
    this.mutableModel = this.modelValue;
  },
};
</script>
<style></style>
