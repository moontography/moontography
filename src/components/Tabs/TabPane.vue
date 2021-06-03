<template>
  <div
    class="tab-pane"
    v-show="active"
    :id="id || label"
    :class="{ active: active }"
    :aria-expanded="active"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "tab-pane",
  props: ["label", "id", "icon"],
  inject: ["addTab", "removeTab"],
  data() {
    return {
      active: false,
    };
  },
  mounted() {
    this.addTab(this);
  },
  unmounted() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.removeTab(this);
  },
};
</script>
<style></style>
