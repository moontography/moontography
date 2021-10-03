<template lang="pug">
.row
  .col-md-10.mx-auto
    card.p-2
      h3.mb-4 #[i.fa.fa-address-book.text-primary.mr-2] Create New Raffle/Lottery

      .card-body(v-loading="globalLoading")
        div.border-bottom.pb-4.mb-4
          div.d-flex.align-items-center.mb-2
            div
              h5.m-0 Reward Token Information
              div
                small Which token(s) are you supplying to be won from the raffle?
            //- checkbox.ml-3(v-model="isRewardTokenNft") Is this an NFT contract?
          token-input-standalone.mb-4(
            v-model="rewardTokenInfo"
            btn-size="sm"
            btn-text="Find reward token from contract"
            :is-nft="isRewardTokenNft")
          div
            label Reward Token {{ isRewardTokenNft ? 'ID' : 'Amount' }}
            input.form-control(
              v-model="rewardAmountOrTokenId"
              type="number"
              placeholder='Raffle Reward Amount (# tokens)')
        div.border-bottom.pb-4.mb-4
          div.mb-2
            h5.m-0 Entry Token Information
            div
              small Which token, if any, will users need to spend to enter the raffle?
          div(:class="isEntryTokenRequired && 'mb-4'")
            checkbox(v-model="isEntryTokenRequired") Is there an entry fee for users to enter the raffle?
          div(v-if="isEntryTokenRequired")
            token-input-standalone.mb-4(
              v-model="entryTokenInfo"
              btn-size="sm"
              btn-text="Find entry token from contract")
            input.form-control(
              v-model="entryFee"
              type="number"
              placeholder='Entry Fee Amount (# tokens)')
        div.mb-4
          div.mb-2
            h5.m-0 Other Information
          div.mb-2
            label Maximum Entries per Wallet (0 means unlimited entries per wallet)
            input.form-control(
              type="number"
              placeholder="Max entries per wallet"
              v-model="maxEntriesPerWallet")
          div.mb-2
            label Start Time That Users Can Begin Entering (Empty means it starts immediately)
            fg-input
              el-date-picker(
                type='datetime'
                placeholder='Start Time'
                v-model='startDateTime')
          div
            label End Time That Users Can Enter Up Until (Empty means it ends when you draw the raffle)
            fg-input
              el-date-picker(
                type='datetime'
                placeholder='End Time'
                v-model='endDateTime')
        div.d-flex.flex-column.align-items-center
          div.text-danger.text-center.mb-2
            div You will spend #[strong {{ costFormatted }}] MTGY to create this new raffle.
            div.mt-1(v-if="entryFeePercentageCharge && entryFeePercentageCharge > 0")
              | #[strong {{ entryFeePercentageCharge }}%] will also be charged from all entry fees.
          n-button(
            type="success"
            size="lg"
            v-loading="globalLoading"
            :disabled="globalLoading || !isRaffleInfoValid"
            @click="createRaffle") Create New Raffle!

</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoading: true,
      isEntryTokenRequired: false,
      entryTokenInfo: null,
      entryFee: null,
      isRewardTokenNft: false,
      rewardTokenInfo: null,
      rewardAmountOrTokenId: null,
      maxEntriesPerWallet: 1,
      startDateTime: null,
      endDateTime: null,
    };
  },

  computed: {
    ...mapState({
      createRaffleCost: (state) => state.raffler.createRaffleCost,
      entryFeePercentageCharge: (state) =>
        state.raffler.entryFeePercentageCharge,
      globalLoading: (state) => state.globalLoading,
    }),

    costFormatted() {
      return new BigNumber(this.createRaffleCost || 0)
        .div(new BigNumber(10).pow(18))
        .toFormat(0);
    },

    isRaffleInfoValid() {
      return (
        this.rewardTokenInfo &&
          this.rewardAmountOrTokenId &&
          this.rewardAmountOrTokenId >= 0,
        this.maxEntriesPerWallet >= 0 &&
          (!this.isEntryTokenRequired ||
            (this.entryTokenInfo && this.entryFee && this.entryFee > 0))
      );
    },
  },

  methods: {
    async createRaffle() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        if (!this.isRaffleInfoValid) {
          throw new Error(
            `Please enter all information below to create a new raffle.`
          );
        }

        await this.$store.dispatch("createRaffle", {
          entryTokenAddress: this.entryTokenInfo && this.entryTokenInfo.address,
          entryFee: this.entryFee || 0,
          isNft: this.isRewardTokenNft,
          rewardTokenAddress: this.rewardTokenInfo.address,
          rewardAmountOrTokenId: this.rewardAmountOrTokenId,
          start: this.startDateTime,
          end: this.endDateTime,
          maxEntriesPerWallet: this.maxEntriesPerWallet,
        });
        this.$toast.success(`Successfully created new raffle!`);
        await this.$store.dispatch("getAllRaffles");
        this.$router.push("/raffler");
      } catch (err) {
        console.error("Error creating raffle", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },
};
</script>
