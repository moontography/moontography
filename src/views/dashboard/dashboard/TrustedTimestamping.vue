<template lang="pug">
.places-sweet-alerts
  .row
    .col-md-6.mx-auto
      card
        .text-center
          component(:is="blockchainHashComponent")
</template>
<script>
import { mapState } from "vuex";
import TimestampingCardEth from "../../../components/TrustedTimestamping/TimestampingCardEth";
import TimestampingCardXlm from "../../../components/TrustedTimestamping/TimestampingCardXlm";

export default {
  data() {
    return {};
  },
  components: {
    TimestampingCardEth,
    TimestampingCardXlm,
  },
  computed: {
    ...mapState({
      activeNetwork: (state) => state.activeNetwork,
    }),

    blockchainHashComponent() {
      return this.activeNetwork === "xlm"
        ? "timestamping-card-xlm"
        : "timestamping-card-eth";
    },
  },
};
</script>
