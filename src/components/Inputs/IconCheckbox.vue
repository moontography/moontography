<template>
  <div
    class="choice"
    :class="{ active: modelValue }"
    data-toggle="wizard-checkbox"
    @click="updateValue"
  >
    <input
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :checked="modelValue"
    />
    <div class="icon">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </div>
    <slot name="title">
      <h6>{{ title }}</h6>
    </slot>
  </div>
</template>
<script>
export default {
  name: "icon-checkbox",
  emits: ["update:modelValue"],
  model: {
    prop: "modelValue",
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    name: String,
    title: String,
    icon: String,
    disabled: Boolean,
  },
  methods: {
    updateValue() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>
<style></style>
