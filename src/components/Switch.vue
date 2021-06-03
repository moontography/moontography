<template>
  <div
    class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate"
    :class="switchClass"
  >
    <div class="bootstrap-switch-container" @click="triggerToggle()">
      <span
        class="bootstrap-switch-handle-on"
        :class="{ [`bootstrap-switch-${color}`]: color }"
      >
        <slot name="on">
          {{ onText }}
        </slot>
      </span>
      <span class="bootstrap-switch-label"></span>
      <span class="bootstrap-switch-handle-off bootstrap-switch-default">
        <slot name="off">
          {{ offText }}
        </slot>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "n-switch",
  emits: ["update:modelValue"],
  props: {
    modelValue: [Array, Boolean],
    onText: String,
    offText: String,
    color: String,
  },
  computed: {
    switchClass() {
      let base = "bootstrap-switch-";
      let state = this.model ? "on" : "off";
      return base + state;
    },
    model: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },
  methods: {
    triggerToggle() {
      this.model = !this.model;
    },
  },
};
</script>
<style></style>
