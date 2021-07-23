<template>
  <div class="form-group" :class="groupClassesAgg">
    <slot name="label">
      <label v-if="label" :class="labelClasses">
        {{ label }}
        <span v-if="required">*</span>
      </label>
    </slot>

    <slot name="addonLeft">
      <div v-if="addonLeftIcon" class="input-group-addon input-group-prepend">
        <i :class="addonLeftIcon"></i>
      </div>
    </slot>
    <slot>
      <input
        v-bind="$attrs"
        class="form-control"
        :class="[{ valid: modelValue && !error }, inputClasses]"
        aria-describedby="addon-right addon-left"
        :value="modelValue"
        v-model="model"
      />
    </slot>
    <slot name="addonRight">
      <span v-if="addonRightIcon" class="input-group-addon input-group-append">
        <i :class="addonRightIcon"></i>
      </span>
    </slot>

    <slot name="infoBlock"></slot>
    <slot name="helpBlock">
      <div
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-if="error"
      >
        {{ error }}
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  name: "fg-input",
  inheritAttrs: false,
  emits: ["update:modelValue"],
  model: {
    prop: "modelValue",
  },
  props: {
    modelValue: [String, Number],
    isError: Boolean,
    isValid: Boolean,
    required: Boolean,
    label: String,
    error: String,
    groupClasses: String,
    labelClasses: String,
    inputClasses: String,
    addonRightIcon: String,
    addonLeftIcon: String,
  },
  data() {
    return {
      touched: false,
      focused: false,
    };
  },
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(check) {
        if (!this.touched) {
          this.touched = true;
        }
        this.$emit("update:modelValue", check);
      },
    },

    groupClassesAgg() {
      const base = [
        { "input-group": this.hasIcon },
        { "has-danger": this.error },
        { "has-danger": this.isError },
        { "input-group-focus": this.focused },
        { "has-label": this.label || this.$slots.label },
        { "has-success": !this.error && this.touched },
        { "has-success": this.isValid },
      ];
      return this.groupClasses ? base.concat([this.groupClasses]) : base;
    },

    hasIcon() {
      const { addonRight, addonLeft } = this.$slots;
      return (
        addonRight !== undefined ||
        addonLeft !== undefined ||
        this.addonRightIcon !== undefined ||
        this.addonLeftIcon !== undefined
      );
    },
  },
  methods: {
    updateValue(evt) {
      let value = evt.target.value;
      if (!this.touched && value) {
        this.touched = true;
      }
      this.$emit("update:modelValue", value);
    },
    onFocus(value) {
      this.focused = true;
      this.$emit("focus", value);
    },
    onBlur(value) {
      this.focused = false;
      this.$emit("blur", value);
    },
  },
};
</script>
<style lang="scss" scoped>
input {
  background-color: #ffffff;

  &:focus {
    ~ .input-group-addon {
      background-color: #ffffff;
    }
  }
}
</style>
