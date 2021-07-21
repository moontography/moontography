<template lang="pug">
drop-down
  template(v-slot:title='')
    n-button.dropdown-toggle(data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' type='primary' block='' round='')
      | Network: {{ networkName ? networkName : 'Choose Network' }}
  h6.dropdown-header Network
  a.dropdown-item(
    v-for="network in networks"
    @click="setModel(network.value)") {{ network.name }}
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "netowrk-selector",
  model: {
    prop: "modelValue",
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: [String, Number],
  },
  computed: {
    ...mapState({
      networks(state) {
        return state.eth.networks.map((n) => {
          return {
            name: n.name,
            value: n.short_name,
          };
        });
      },
    }),

    networkName() {
      return this.modelValue
        ? this.networks.find((n) => n.value == this.modelValue).name
        : null;
    },
  },
  methods: {
    setModel(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
};
</script>
<style></style>
