<template lang="pug">
.row
  .col-md-12(v-if="localError")
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
  .col-md-8.mx-auto(v-else)
    .row.mb-2
      .col-lg-12.d-flex.justify-content-center
        card
          h4.m-0.text-center.py-4
            | Affiliate leaderboard and review is coming soon!
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      localError: null,

      // columns: [
      //   { value: "token", text: "Token", classes: "" },
      //   { value: "channel", text: "Telegram Channel", classes: "" },
      //   {
      //     value: "minThresholdUsd",
      //     text: "Buy Threshold ($)",
      //     classes: "",
      //   },
      //   { value: "expiration", text: "Expiration", classes: "" },
      // ],
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
    }),
  },
};
</script>
