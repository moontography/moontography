<template lang="pug">
.row
  .col-md-6.mx-auto
    card
      .text-center
        loading-panel(v-if="isLoading")
        component(
          v-else
          :is="blockchainHashComponent")

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
    return {
      isLoading: true,
    };
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

  async created() {
    try {
      await this.$store.dispatch("trustedTimestampingInit");
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
