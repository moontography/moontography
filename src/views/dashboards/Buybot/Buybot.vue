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
            div
              div.d-flex.align-items-center
                h4.card-title.mb-0
                  | Buybot 🟢 🟢 🟢 🟢
                div.ml-auto
                  n-button(
                    :disabled="globalLoading"
                    v-loading="globalLoading"
                    type='success'
                    round=''
                    data-toggle="modal"
                    data-target="#create-buybot-modal") Create Buybot Now!
          //-     div.text-secondary
          //-       small The token you are interested in for a buy bot!
          //- token-input-standalone(
          //-   v-model="tokenInfo"
          //-   btn-size="sm"
          //-   btn-text="Find buybots for token contract")

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
                      td
                        a(
                          :href="`${activeNetwork.explorer_url}/address/${row.item.token}`"
                          target="_blank"
                          rel="noopener noreferrer")
                            | {{ row.item.tokenInfo.symbol }} ({{ row.item.tokenInfo.name }})
                      td
                        a(
                          :href="`https://t.me/${row.item.channelInfo.username}`"
                          target="_blank"
                          rel="noopener noreferrer")
                            | {{ row.item.channelInfo.title }}
                      td ${{ row.item.minThresholdUsd }} minimum buys
                      td(:class="expirationClass(row.item.expiration)") {{ expirationFormatted(row.item.expiration) }}

create-buybot-modal#create-buybot-modal(@setup="$store.dispatch('buybotInit')")
</template>

<script>
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
        { value: "channel", text: "Telegram Channel", classes: "" },
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
    expirationClass(expiration) {
      if (!expiration) return "";
      const daysFromNow = dayjs.unix(expiration).diff(dayjs(), "days");
      return daysFromNow < 14 ? "text-danger" : "text-success";
    },

    expirationFormatted(expiration) {
      return (
        expiration && dayjs.unix(expiration).format("MMM Do, YYYY hh:mm a")
      );
    },
  },
};
</script>
