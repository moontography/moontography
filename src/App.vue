<template lang="pug">
router-view
</template>

<script>
export default {
  async created() {
    await this.$store.dispatch("init", true);
  },
};
</script>
