<template>
  <slot name="label">
    <label v-if="label" :class="labelClasses">
      {{ label }}
      <span v-if="required">*</span>
    </label>
  </slot>

  <div
    class="form-group"
    :class="[
      {
        'has-danger': !!errorMessage,
        'has-success': meta.valid,
        'input-group': hasIcon,
        'input-group-focus': focused,
        'has-label': label || $slots.label,
      },
      inputClasses,
    ]"
  >
    <slot name="addonLeft">
      <div v-if="addonLeftIcon" class="input-group-addon input-group-prepend">
        <i :class="addonLeftIcon"></i>
      </div>
    </slot>
    <slot>
      <input
        class="form-control"
        :name="name"
        :id="name"
        :type="type"
        :placeholder="placeholder"
        :value="inputValue"
        @input="handleChange"
        @blur="focused = false"
        @focus="focused = true"
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
        v-show="errorMessage"
      >
        {{ errorMessage }}
      </div>
    </slot>
  </div>
</template>

<script>
import { useField } from "vee-validate";

export default {
  name: "vee-input",
  props: {
    addonRightIcon: String,
    addonLeftIcon: String,
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    labelClasses: {
      type: String,
      default: "",
    },
    inputClasses: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
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
  setup(props) {
    const { value: inputValue, errorMessage, handleChange, meta } = useField(
      props.name,
      undefined,
      {
        initialValue: props.value,
      }
    );

    return {
      handleChange,
      errorMessage,
      inputValue,
      meta,
    };
  },
};
</script>

<style></style>
