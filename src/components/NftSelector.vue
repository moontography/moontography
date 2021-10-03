<template lang="pug">
div(@click="select")
  p.mb-1(style="font-weight: bold")
    | {{ nft.nft_name }}
    | #[i.fa(:class="isSelected ? 'fa-check text-success' : 'fa-times text-danger'")]
  img(
    v-if="nft.image"
    style="max-height: 100px; width: auto"
    :class="isSelected ? 'nft-selected' : ''"
    :src="nft.image")
  div.d-inline-block.border(v-else)
    i No NFT image...
</template>
<script>
export default {
  name: "nft-selector",
  emits: ["select"],
  props: {
    nft: Object,
    isSelected: Boolean,
  },
  methods: {
    select() {
      this.$emit("select", this.nft.token_id);
    },
  },
};
</script>
<style lang="scss" scoped>
.nft-selected {
  outline: 1px solid #18ce0f;
}
</style>
