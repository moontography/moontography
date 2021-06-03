<template>
  <div class="card card-plain">
    <div :id="'headingOne' + id + 1" class="card-header">
      <a
        data-toggle="collapse"
        :data-target="'#headingOne' + id"
        :aria-expanded="active"
        :aria-controls="`content-${id}`"
      >
        <slot name="title">
          {{ title }}
        </slot>
        <i class="now-ui-icons arrows-1_minimal-down"></i>
      </a>
    </div>

    <div
      :id="'headingOne' + id"
      data-parent="#accordionExample"
      role="tabpanel"
      :aria-labelledby="'headingOne' + id + 1"
      class="collapse"
      :class="{ show: active }"
    >
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "collapse-item",
  props: {
    title: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    id: String,
  },
  inject: {
    addItem: {
      default: () => {},
    },
    removeItem: {
      default: () => {},
    },
  },
  mounted() {
    this.addItem(this);
  },
  unmounted() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.removeItem(this);
  },
};
</script>
<style></style>
