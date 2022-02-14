<template lang="pug">
.row
  .col-md-12(v-if="localError")
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
  .col-md-8.mx-auto(v-else)
    .row.mb-2
      .col-lg-12.d-flex.justify-content-center
        n-button(
          :disabled="globalLoading"
          v-loading="globalLoading"
          type='primary'
          round=''
          data-toggle="modal"
          data-target="#create-buybot-modal") Add Buybot for your Token
      .col-lg-12
        card
          template(v-slot:header='')
            div
              div.d-flex.align-items-center
                h4.card-title.mb-0
                  | Buybot
              div.text-secondary
                small The token you are interested in for a buy bot!
          token-input-standalone(
            v-model="tokenInfo"
            btn-size="sm"
            btn-text="Find buybots for token contract")

          .row
            .col-lg-12
              div.pt-3(v-if="!allBuybots || allBuybots.length === 0")
                i
                  | No buybots configured yet.
              div.table-full-width.table-responsive.pb-0(v-else)
                n-table.mb-0(
                  :columns="columns"
                  :data='allBuybots')
                    template(v-slot:columns)
                    template(v-slot:default='row')
                      td {{ row.item.token }}
                      td {{ row.item.client }}
                      td ${{ row.item.minThresholdUsd }} USD buys
                      td {{ expirationFormatted(row.item.expiration) }}

create-buybot-modal#create-buybot-modal(@setup="$store.dispatch('buybotInit')")
</template>

<script>
// import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";
import CreateBuybotModal from "./CreateBuybotModal";

export default {
  components: {
    CreateBuybotModal,
  },

  data() {
    return {
      localError: null,
      tokenInfo: null,

      columns: [
        { value: "token", text: "Token", classes: "" },
        { value: "client", text: "Message Client", classes: "" },
        {
          value: "minThresholdUsd",
          text: "Buy Threshold ($)",
          classes: "",
        },
        { value: "expiration", text: "Expiration", classes: "" },
      ],
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
      allBuybots: (state) => state.buybot.bots,
    }),
  },

  methods: {
    expirationFormatted(expiration) {
      return (
        expiration && dayjs.unix(expiration).format("MMM Do, YYYY hh:mm a")
      );
    },
  },
};
</script>
