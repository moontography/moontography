<template lang="pug">
.row
  .col-md-8.mx-auto
    card
      template(v-slot:header='')
        h4.card-title
          | Navigation Pills
      tabs(type='primary' v-model:value='activeTab')
        tab-pane(label='Profile')
          | Collaboratively administrate empowered markets via plug-and-play
          | networks. Dynamically procrastinate B2C users after installed base
          | benefits.
          br
          br
          |               Dramatically visualize customer directed convergence without
          |               revolutionary ROI.
        tab-pane(label='Settings')
          | Efficiently unleash cross-media information without cross-media
          | value. Quickly maximize timely deliverables for real-time schemas.
          br
          br
          | Dramatically maintain clicks-and-mortar solutions
          |               without functional solutions.
        tab-pane(label='Options')
          | Completely synergize resource taxing relationships via premier
          | niche markets. Professionally cultivate one-to-one customer
          | service with robust ideas.
          br
          br
          | Dynamically innovate resource-leveling customer
          |               service for state of the art customer service.

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
