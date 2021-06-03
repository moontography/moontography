<template>
  <div class="form-check form-check-radio" :class="{ disabled: disabled }">
    <label class="form-check-label">
      <input
        class="form-check-input"
        type="radio"
        :checked="checked"
        :name="name"
        :disabled="disabled"
      />
      <span class="form-check-sign"> </span>
      <slot></slot>
    </label>
  </div>
</template>
<script>
export default {
  name: "n-radio",
  props: {
    name: [String, Number],
    disabled: Boolean,
    inline: Boolean,
    checked: Boolean,
  },
};
</script>
