<template>
  <ul class="pagination" :class="paginationClass">
    <li class="page-item prev-page" :class="{ disabled: modelValue === 1 }">
      <a class="page-link" aria-label="Previous" @click="prevPage"> « </a>
    </li>
    <li
      class="page-item"
      v-for="item in range(minPage, maxPage)"
      :key="item"
      :class="{ active: modelValue === item }"
    >
      <a class="page-link" @click="changePage(item)">{{ item }}</a>
    </li>
    <li
      class="page-item page-pre next-page"
      :class="{ disabled: modelValue === totalPages }"
    >
      <a class="page-link" aria-label="Next" @click="nextPage"> » </a>
    </li>
  </ul>
</template>
<script>
export default {
  name: "n-pagination",
  emits: ["update:modelValue"],
  props: {
    type: {
      type: String,
      default: "primary",
      validator: (value) => {
        return [
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info",
        ].includes(value);
      },
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    paginationClass() {
      return `pagination-${this.type}`;
    },
    totalPages() {
      if (this.pageCount > 0) return this.pageCount;
      if (this.total > 0) {
        return Math.ceil(this.total / this.perPage);
      }
      return 1;
    },
    pagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages;
      }
      return this.defaultPagesToDisplay;
    },
    minPage() {
      if (this.modelValue >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.modelValue;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1;
        }
        return this.modelValue - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.modelValue >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.modelValue;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.pagesToDisplay;
      }
    },
  },
  data() {
    return {
      defaultPagesToDisplay: 5,
    };
  },
  methods: {
    range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    changePage(item) {
      this.$emit("update:modelValue", item);
    },
    nextPage() {
      if (this.modelValue < this.totalPages) {
        this.$emit("update:modelValue", this.modelValue + 1);
      }
    },
    prevPage() {
      if (this.modelValue > 1) {
        this.$emit("update:modelValue", this.modelValue - 1);
      }
    },
  },
  watch: {
    perPage() {
      this.$emit("update:modelValue", 1);
    },
    total() {
      this.$emit("update:modelValue", 1);
    },
  },
};
</script>
