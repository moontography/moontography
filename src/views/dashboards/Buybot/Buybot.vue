<template lang="pug">
.row
  .col-md-12(v-if="localError")
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
  .col-md-8.mx-auto(v-else)
    .row.mb-2
      .col-lg-12
        card
          template(v-slot:header='')
            div.d-flex.align-items-center
              h4.card-title.mb-0
                | Buybot
              //- checkbox.ml-3(v-model="isAirdroppingTokenNft") Are you airdropping NFTs from an ERC721 contract?
              //- div.text-secondary
              //-   small The token users can stake to earn rewards from the rewards pool you've provided.
          //- token-input-standalone(
          //-   v-model="tokenInfo"
          //-   btn-text="Set Token to Airdrop"
          //-   :is-nft="isAirdroppingTokenNft")
</template>

<script>
// import BigNumber from "bignumber.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      localError: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
      // web3: (state) => state.web3.instance,
    }),

    // totalAmountToSend() {
    //   const total = this.addresses.reduce(
    //     (total, info) => new BigNumber(total).plus(info.tokens || 0),
    //     new BigNumber(0)
    //   );
    //   return total.toFormat(6);
    // },
  },

  methods: {},

  async created() {
    // await this.$store.dispatch("getAirdropperCost");
  },
};
</script>
