<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Make Plot Loanable
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.mb-4
            | This process transfers your plot NFT to a loan contract so others can pay you for
            | your ad/plot space. You can remove your plot at any time from the loan contract, but
            | note you will have to reimburse an active loan if you remove in the middle of the term.
          //- label Please enter your swap information here to claim your tokens
          label Per day charge to lend your plot in ETH (#[strong Default: 0.001 ETH])
          fg-input(
            type="number"
            plceholder="Override Per Day Charge in Ether (Default: 0.001 ETH)"
            v-model="overridePerDayCharge")
          label Max number of days someone can loan your plot (#[strong Default: 30 days])
          fg-input(
            type="number"
            plceholder="Max Number of Days Someone Can Loan (Default: 30 days)"
            v-model="overrideMaxDays")
          div.mt-4
            | We charge a one time fee of #[strong {{ oneTimeLoanChargeFormatted }} {{ currencySymbol }}]
            | to use our lending service and #[strong {{ perLoanPercentageCharge }}%] of every loan charge of your plot.
          div.mt-1.d-flex.align-items-center.justify-content-center
            n-button(
              type="primary"
              :disabled="globalLoading"
              v-loading="globalLoading"
              @click="makeLoanable") {{ plot.isLoanable ? 'Update Plot' : 'Make your plot loanable!' }}
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
export default {
  props: {
    plot: { type: Object, required: true },
  },

  data() {
    return {
      oneTimeLoanCharge: null,
      perLoanPercentageCharge: null,
      overridePerDayCharge: null,
      overrideMaxDays: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
    }),

    currencySymbol() {
      return (this.activeNetwork.native_currency || {}).symbol || "ETH";
    },

    oneTimeLoanChargeFormatted() {
      return new BigNumber(this.oneTimeLoanCharge || 0)
        .div(new BigNumber(10).pow(18))
        .toFixed();
    },
  },

  methods: {
    async makeLoanable() {
      try {
        let overridePerDayCharge = 0;
        if (this.overridePerDayCharge && this.overridePerDayCharge > 0) {
          overridePerDayCharge = new BigNumber(this.overridePerDayCharge)
            .times(new BigNumber(10).pow(18))
            .toFixed();
        }

        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("makeKetherPlotLoanable", {
          index: this.plot.index,
          overridePerDayCharge: overridePerDayCharge || 0,
          overrideMaxDays: this.overrideMaxDays || 0,
        });
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully made your plot loanable!`);
        $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async mounted() {
    $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
      this.overridePerDayCharge = null;
      this.overrideMaxDays = null;
    });

    const [oneTimeCharge, perLoanPercentageCharge] = await Promise.all([
      this.$store.dispatch("getAddPlotToMakeLoanableCharge"),
      this.$store.dispatch("getPerLoanServicePercentage"),
    ]);
    this.oneTimeLoanCharge = oneTimeCharge;
    this.perLoanPercentageCharge = perLoanPercentageCharge;
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
