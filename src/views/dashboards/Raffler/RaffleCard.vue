<template lang="pug">
card.p-2
  loading-panel(v-if="isLoadingLocal")
  template(v-else)
    h3.m-0 #[i.fa.fa-ticket.text-primary.mr-2]
      router-link(:to="`/raffler/${raffleId}`")
        | {{ rewardAmountFormatted }} {{ raffleInfo.rewardTokenInfo.symbol }}
    .card-body.text-center
      div.reward-info.mb-4
        div.mb-2 This raffle will reward:
        div(v-if="raffleInfo && raffleInfo.isNft")
          nft-selector(
            v-if="nftInfo"
            :nft="nftInfo")
          div(v-else)
            i NFT info currently unavailable...
        div(v-else)
          div
            a(
              :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${raffleInfo.rewardToken}`"
              target="_blank"
              rel="noopener noreferrer")
                strong {{ rewardAmountFormatted }} {{ raffleInfo.rewardTokenInfo.symbol }}
          //- div
          //-   small {{ raffleInfo.rewardTokenInfo.name }}
      div.creator-info.p-3.mb-4.rounded.border
        small
          div Raffle creator
          div
            strong {{ raffleInfo.owner }}
          div.row.mt-4(v-if="raffleInfo.start > 0 || raffleInfo.end > 0")
            div.col-lg-6(v-if="raffleInfo.start > 0")
              div Begins
              div
                strong {{ dateFormatted(raffleInfo.start) }}
            div.col-lg-6(v-if="raffleInfo.end > 0")
              div Ends
              div
                strong {{ dateFormatted(raffleInfo.end) }}
      div.user-entry-info.mb-4
        h5.m-0 Entry Fee
        div(v-if="!hasEntryFee")
          div.text-success No entry fee!
        div(v-else-if="raffleInfo.entryTokenInfo")
          div
            small To enter the raffle you will spend (per entry):
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
          div.col-lg-6(v-if="raffleInfo.entryTokenInfo")
            div Entry Fees Collected
            div
              strong
                span(v-if="raffleInfo.entryTokenInfo") {{ entryFeesCollectedFormatted }} {{ raffleInfo.entryTokenInfo.symbol }}
                span(v-else) No Entry Fee
      div.num-entries.mb-4.pt-4.border-top(v-if="canUserEnter && getMaxNumEntriesUserHasLeft > 1")
        div Number of entries you want to add
        slider(
          v-model="numberOfEntries"
          :range="{ min: 1, max: getMaxNumEntriesUserHasLeft }"
          :options="{ step: 1 }")
        div.d-flex.justify-content-center {{ numberOfEntries }}
      div.d-flex.justify-content-center(v-if="canUserEnter || isUserRaffleOwner || canUserDrawWinner")
        n-button(
          v-if="canUserEnter"
          type="success"
          size="sm"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="enterRaffle")
            | Enter Raffle
            | #[span(v-if="raffleInfo.entryTokenInfo") ({{ getEntryFeesUserWillSpend }} {{ raffleInfo.entryTokenInfo.symbol }})]
        n-button.ml-2(
          v-if="isUserRaffleOwner"
          type="secondary"
          size="sm"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="closeRaffle") Close Raffle
        n-button.ml-2(
          v-if="canUserDrawWinner"
          type="danger"
          size="sm"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="drawWinner") Draw Winner
      div.alert.alert-success(v-else-if="raffleInfo.isComplete")
        div Raffle Winner
        div
          strong {{ raffleInfo.winner }}
</template>

<script>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoadingLocal: true,
      nftInfo: null,
      numberOfEntries: 1,
    };
  },

  props: {
    raffleId: { type: String, default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
      activeNetworkExplorerUrl: (_, getters) =>
        getters.activeNetworkExplorerUrl,
      tokenRoute: (_, getters) => getters.tokenRoute,
      rafflerAddy: (_, getters) => getters.activeNetwork.contracts.raffler,
      raffleInfo(state) {
        return state.raffler.raffleInfo[this.raffleId];
      },
    }),

    canUserDrawWinner() {
      return (
        this.raffleInfo &&
        !this.raffleInfo.isComplete &&
        this.userAddy.toLowerCase() === this.raffleInfo.owner.toLowerCase() &&
        (this.raffleInfo.end == "0" ||
          dayjs
            .unix(new BigNumber(this.raffleInfo.end).toNumber())
            .isBefore(dayjs()))
      );
    },

    isUserRaffleOwner() {
      return (
        this.raffleInfo &&
        !this.raffleInfo.isComplete &&
        this.userAddy.toLowerCase() === this.raffleInfo.owner.toLowerCase()
      );
    },

    canUserEnter() {
      return (
        this.raffleInfo &&
        !this.raffleInfo.isComplete &&
        (this.raffleInfo.start == "0" ||
          dayjs
            .unix(new BigNumber(this.raffleInfo.start).toNumber())
            .isBefore(dayjs())) &&
        (this.raffleInfo.end == "0" ||
          dayjs
            .unix(new BigNumber(this.raffleInfo.end).toNumber())
            .isAfter(dayjs())) &&
        (this.raffleInfo.maxEntriesPerAddress == 0 ||
          new BigNumber(this.raffleInfo.userEntries).lt(
            this.raffleInfo.maxEntriesPerAddress
          ))
      );
    },

    getMaxNumEntriesUserHasLeft() {
      return this.raffleInfo.maxEntriesPerAddress == "0"
        ? 100
        : new BigNumber(this.raffleInfo.maxEntriesPerAddress)
            .minus(this.raffleInfo.userEntries)
            .toNumber();
    },

    getEntryFeesUserWillSpend() {
      if (this.entryFeeFormatted == 0) return 0;
      return new BigNumber(this.numberOfEntries)
        .times(this.entryFeeFormatted)
        .toFormat(2);
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
          this.raffleInfo.entryTokenInfo &&
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
    dateFormatted(d) {
      return dayjs
        .unix(new BigNumber(d).toNumber())
        .format("MMMM Do, YYYY HH:mm");
    },

    async init() {
      await this.$store.dispatch("getRaffle", this.raffleId);
      if (this.raffleInfo && this.raffleInfo.isNft) {
        const allUserNftTokens = await this.$store.dispatch(
          "getUserOwnedNfts",
          {
            tokenAddress: this.raffleInfo.rewardTokenInfo.address,
            ownerAddress: this.rafflerAddy,
          }
        );
        this.nftInfo = allUserNftTokens.find(
          (nft) => this.raffleInfo.rewardAmountOrTokenId == nft.token_id
        );
      }
    },

    async enterRaffle() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("enterRaffle", {
          id: this.raffleId,
          numEntries: new BigNumber(this.numberOfEntries).toFixed(0),
        });
        this.numberOfEntries = 1;
        this.$toast.success(`Successfully entered the raffle!`);
        await this.init();
      } catch (err) {
        console.error("Error entering raffle", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async closeRaffle() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("closeRaffleAndRefund", this.raffleId);
        this.$toast.success(`Successfully closed raffle!`);
        await this.init();
      } catch (err) {
        console.error("Error drawing winner", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async drawWinner() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("drawRaffleWinner", this.raffleId);
        this.$toast.success(`Successfully drew raffle winner!`);
        await this.init();
      } catch (err) {
        console.error("Error drawing winner", err);
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
