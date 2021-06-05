<template lang="pug">
span(v-loading="globalLoading")
  slot(:disabled="globalLoading")
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),
  },
};
</script>
