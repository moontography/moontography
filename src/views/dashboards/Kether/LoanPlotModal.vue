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
            | Loan Plot!
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.mb-4
            | When you loan this plot you will be able to manage and publish images/ads to
            | the plot over the lifetime of the loan.
          div.mb-4
            table.table.table-bordered
              thead
                tr
                  th idx
                  th x
                  th y
                  th width
                  th height
              tbody
                tr
                  td {{ plot.index }}
                  td {{ plot.x }}
                  td {{ plot.y }}
                  td {{ plot.width * 10 }}px
                  td {{ plot.height * 10 }}px
          hr
          label Number of days to loan plot
          fg-input.mb-3(
            type="number"
            placeholder="Days"
            v-model="numDays")
          label Ad Title (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Title"
            v-model="ad.title")
          label Ad Link (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Link"
            v-model="ad.link")
          label Ad Image Link (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Image Link"
            v-model="ad.image")
          checkbox(v-model="ad.NSFW") 
            label Is ad risque or otherwise not safe for school/work?
          hr
          div.mt-4.text-center
            | This plot has a per-day charge of #[strong {{ perDayChargeFormatted }} {{ currencySymbol }}].
            | A term of  {{ numDays }} days will cost you #[strong {{ totalChargeFormatted }} {{ currencySymbol }}].
          div.mt-1.d-flex.align-items-center.justify-content-center(v-if="!isPlotCurrentlyLoaned")
            n-button(
              type="primary"
              :disabled="globalLoading"
              v-loading="globalLoading"
              @click="loanPlot") Loan plot now!
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
      numDays: 1,
      perDayCharge: null,
      ad: {
        title: null,
        link: null,
        image: null,
        NSFW: false,
      },
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
    }),

    isPlotCurrentlyLoaned() {
      return this.plot.hasActiveLoan;
    },

    currencySymbol() {
      return (this.activeNetwork.native_currency || {}).symbol || "ETH";
    },

    perDayChargeFormatted() {
      return new BigNumber(this.perDayCharge || 0)
        .div(new BigNumber(10).pow(18))
        .toFixed();
    },

    totalChargeFormatted() {
      return new BigNumber(this.perDayChargeFormatted)
        .times(this.numDays)
        .toFixed();
    },
  },

  methods: {
    async loanPlot() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("loanPlot", {
          index: this.plot.index,
          numDays: this.numDays,
          publishInfo: [
            this.ad.link || "",
            this.ad.image || "",
            this.ad.title || "",
            this.ad.NSFW || false,
          ],
        });
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully loaned plot!`);
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
      this.numDays = 1;
    });

    const [perDayCharge] = await Promise.all([
      this.$store.dispatch("getLoanPlotPerDayCharge", this.plot.index),
    ]);
    this.perDayCharge = perDayCharge;
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
