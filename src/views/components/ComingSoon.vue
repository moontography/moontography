<template lang="pug">
.row
  .col-md-6.mx-auto
    card
      .text-center
        coming-soon-card
          timeline
</template>
<script>
import { mapState } from "vuex";
import Timeline from "../components/Timeline";
import ComingSoonCard from "@/components/Cards/ComingSoonCard";

export default {
  data() {
    return {};
  },
  components: {
    ComingSoonCard,
    Timeline,
  },
  computed: {
    ...mapState({}),
  },
};
</script>
