<template>
  <div id="accordionExample" class="card-collapse accordion">
    <slot></slot>
  </div>
</template>

<script>
import { nextTick } from "vue";

export default {
  name: "collapse",
  provide() {
    return {
      addItem: this.addItem,
      removeItem: this.removeItem,
    };
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    addItem(item) {
      const index = item.$.uid;
      if (index !== -1) {
        this.items.splice(index, 0, item);
      }
    },
    removeItem(item) {
      const items = this.items;
      const index = items.indexOf(item);
      if (index > -1) {
        items.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped></style>
