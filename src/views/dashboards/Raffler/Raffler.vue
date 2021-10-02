<template lang="pug">
div.alert.alert-danger(v-if="filteredRaffles.length === 0")
  | There are no raffles available to enter.
div.row(v-else)
  div.col-md-6.col-lg-4(v-for="id in filteredRaffles")
    raffle-card(:raffle-id="id")
</template>

<script>
import { mapState } from "vuex";
import RaffleCard from "./RaffleCard";

export default {
  components: {
    RaffleCard,
  },

  data() {
    return {
      isLoading: true,
      filters: {
        includeComplete: false,
      },
    };
  },

  props: {
    raffleId: { type: String, default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      raffleIds: (state) => state.raffler.allRaffleIds || [],
      userAddy: (state) => state.web3.address,

      filteredRaffles(state) {
        return this.raffleIds === 0 ||
          (this.raffleIds.length > 0 &&
            Object.keys(state.raffler.raffleInfo).length === 0)
          ? this.raffleIds
          : this.raffleIds.filter(
              (id) =>
                state.raffler.raffleInfo[id] &&
                (!this.filters.includeComplete ||
                  !state.raffler.raffleInfo[id].isComplete ||
                  state.raffler.raffleInfo[id].owner.toLowerCase() ===
                    this.userAddy.toLowerCase())
            );
      },
    }),
  },
};
</script>
