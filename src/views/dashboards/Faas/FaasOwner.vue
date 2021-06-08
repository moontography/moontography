<template lang="pug">
.row
  .col-md-8.mx-auto
    card
      template(v-slot:header='')
        h4.card-title
          | Project Owner
      tabs(type='primary' v-model:value='activeTab')
        tab-pane(label='Profile')
          | Horayyyyyyyyyy!

</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    tokenAddress: { type: String, default: null },
  },

  data() {
    return {
      activeTab: "Profile",
    };
  },
  computed: {
    ...mapState({
      activeNetwork: (state) => state.activeNetwork,
    }),
  },
};
</script>
