<template lang="pug">
div.row(v-if="filteredRaffles.length === 0")
  div.col-xl-8.mx-auto
    card
      h4.m-0.text-center.py-4
        | #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]
        | There are no raffles available to enter yet in {{ activeNetwork.name }}.
        | #[img.img-fluid(style="max-width: 20px" :src="activeNetworkLogo")]
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
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      raffleIds: (state) => state.raffler.allRaffleIds || [],
      userAddy: (state) => state.web3.address,

      filteredRaffles(state) {
        return this.raffleIds.length === 0 ||
          (this.raffleIds.length > 0 &&
            Object.keys(state.raffler.raffleInfo).length === 0)
          ? this.raffleIds
          : this.raffleIds.filter(
              (id) =>
                state.raffler.raffleInfo[id] &&
                (this.filters.includeComplete ||
                  !state.raffler.raffleInfo[id].isComplete ||
                  state.raffler.raffleInfo[id].owner.toLowerCase() ===
                    this.userAddy.toLowerCase()) &&
                !state.raffler.raffleInfo[id].isClosed
            );
      },
    }),
  },
};
</script>
