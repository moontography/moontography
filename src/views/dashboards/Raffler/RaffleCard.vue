<template lang="pug">
card.p-2
  loading-panel(v-if="isLoadingLocal")
  template(v-else)
    h3.m-0 #[i.fa.fa-address-book.text-primary.mr-2]
      | {{ rewardAmountFormatted }} {{ raffleInfo.rewardTokenInfo.symbol }}
    .card-body.text-center
      div.reward-info.mb-4
        div This raffle will reward
        div(v-if="raffleInfo.isNft")
          nft-selector(:nft="raffleInfo.rewardTokenInfo")
        div(v-else)
          div
            a(
              :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${raffleInfo.rewardToken}`"
              target="_blank"
              rel="noopener noreferrer")
                strong {{ rewardAmountFormatted }} {{ raffleInfo.rewardTokenInfo.symbol }}
          div
            small {{ raffleInfo.rewardTokenInfo.name }}
      div.user-entry-info.mb-4.pt-4.border-top
        h5.m-0 Entry Fee
        div(v-if="!hasEntryFee")
          div.text-success No entry fee!
        div(v-else)
          div
            small To enter the raffle you will spend
          div
            a(
              :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${raffleInfo.entryToken}`"
              target="_blank"
              rel="noopener noreferrer")
                strong {{ entryFeeFormatted }} {{ raffleInfo.entryTokenInfo.symbol }}
        div.mt-2
          small
            | You have #[strong {{ raffleInfo.userEntries }}] entries in this raffle
            | and can have a maximum of #[strong {{ raffleInfo.maxEntriesPerAddress == 0 ? 'unlimited' : raffleInfo.maxEntriesPerAddress }}]
            | entries.
      div.raffle-entry-info.mb-4.pt-4.border-top
        div.row
          div.col-lg-6
            div Total Entries
            div
              strong {{ raffleInfo.entries && raffleInfo.entries.length || 0 }}
          div.col-lg-6
            div Entry Fees Collected
            div
              strong
                span(v-if="raffleInfo.entryTokenInfo") {{ entryFeesCollectedFormatted }} {{ raffleInfo.entryTokenInfo.symbol }}
                span(v-else) No Entry Fee
      div.d-flex.justify-content-center(v-if="canUserEnter")
        n-button(
          type="success"
          size="sm"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="enterRaffle") Enter Raffle
</template>

<script>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoadingLocal: true,
    };
  },

  props: {
    raffleId: { type: String, default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      activeNetworkExplorerUrl: (_, getters) =>
        getters.activeNetworkExplorerUrl,
      tokenRoute: (_, getters) => getters.tokenRoute,
      raffleInfo(state) {
        return state.raffler.raffleInfo[this.raffleId];
      },
    }),

    canUserEnter() {
      return (
        this.raffleInfo &&
        !this.raffleInfo.isComplete &&
        (this.raffleInfo.start == "0" ||
          dayjs
            .unix(new BigNumber(this.raffleInfo.start).times(1000).toNumber())
            .isBefore(dayjs())) &&
        (this.raffleInfo.end == "0" ||
          dayjs
            .unix(new BigNumber(this.raffleInfo.end).times(1000).toNumber())
            .isAfter(dayjs())) &&
        this.raffleInfo.userEntries < this.raffleInfo.maxEntriesPerAddress
      );
    },

    hasEntryFee() {
      return (
        this.raffleInfo &&
        this.raffleInfo.entryFee &&
        new BigNumber(this.raffleInfo.entryFee).gt(0) &&
        this.raffleInfo.entryToken &&
        new BigNumber(this.raffleInfo.entryToken.toLowerCase()).gt(0)
      );
    },

    entryFeesCollectedFormatted() {
      return (
        (this.raffleInfo &&
          this.raffleInfo.entryFeesCollected &&
          this.raffleInfo.entryTokenInfo &&
          new BigNumber(this.raffleInfo.entryFeesCollected)
            .div(new BigNumber(10).pow(this.raffleInfo.entryTokenInfo.decimals))
            .toFormat(2)) ||
        0
      );
    },

    entryFeeFormatted() {
      return (
        (this.raffleInfo &&
          this.raffleInfo.entryFee &&
          new BigNumber(this.raffleInfo.entryFee)
            .div(new BigNumber(10).pow(this.raffleInfo.entryTokenInfo.decimals))
            .toFormat(2)) ||
        0
      );
    },

    rewardAmountFormatted() {
      if (!this.raffleInfo) return 0;
      if (this.raffleInfo.isNft) return this.raffleInfo.rewardAmountOrTokenId;
      return (
        (this.raffleInfo.rewardAmountOrTokenId &&
          new BigNumber(this.raffleInfo.rewardAmountOrTokenId)
            .div(
              new BigNumber(10).pow(this.raffleInfo.rewardTokenInfo.decimals)
            )
            .toFormat(2)) ||
        0
      );
    },
  },

  methods: {
    async init() {
      await this.$store.dispatch("getRaffle", this.raffleId);
    },

    async enterRaffle() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("enterRaffle", this.raffleId);
        this.$toast.success(`Successfully entered the raffle!`);
        await this.init();
      } catch (err) {
        console.error("Error creating swap", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async created() {
    try {
      await this.init();
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.isLoadingLocal = false;
    }
  },
};
</script>
