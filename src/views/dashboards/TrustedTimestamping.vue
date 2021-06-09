<template lang="pug">
.row
  .col-md-4.mx-auto
    card
      .text-center
        component(:is="blockchainHashComponent")

.row
  .col-md-12.mx-auto
    timestamping-paginated-table
</template>
<script>
import { mapState } from "vuex";
import TimestampingCardEth from "@/components/TrustedTimestamping/TimestampingCardEth";
import TimestampingCardXlm from "@/components/TrustedTimestamping/TimestampingCardXlm";
import TimestampingPaginatedTable from "@/components/TrustedTimestamping/TimestampingPaginatedTable";

export default {
  data() {
    return {};
  },
  components: {
    TimestampingCardEth,
    TimestampingCardXlm,
    TimestampingPaginatedTable,
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
