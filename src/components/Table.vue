<template lang="pug">
table.table
  thead
    tr
      slot(name='columns')
        th(v-for="column in columns" :key="column.value" :class="column.classes")
          small  {{ column.text }} 
  tbody
    tr(v-for='(item, index) in data' :key='index')
      slot(:item='{ ...item, index }')
        td(v-for='column in columns' :key='column.value' :class="column.classes")
          template(v-if='hasValue(item, column.value)')
            | {{ itemValue(item, column.value) }}
    tr(v-if="$slots['summary-row']")
      slot(name='summary-row')
</template>
<script>
export default {
  name: "n-table",
  props: {
    columns: Array,
    data: Array,
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
  },
};
</script>
<style></style>
