<template lang="pug">
stats-card(
  :type='type'
  :title='`idx: ${plot.index}`'
  :sub-title='`${ plot.width * 10 }x${ plot.height * 10 } (${ plotArea }px)`'
  :icon='`now-ui-icons ${iconClass}`'
  :icon-title="isWrapped ? 'Plot is wrapped!' : 'Not wrapped yet'")
    div.d-flex.flex-column.align-items-center.my-2
      div.mb-3
        a(
          v-if="plot.image"
          :href="plot.link"
          target="_blank"
          rel="noopener noreferrer")
            img(
              :style="{borderRadius: '0px', width: `${plot.width * 10}px`, height: `${plot.height * 10}px`}"
              :src="plot.image")
        i(v-else) No published ad yet!
      div.text-secondary
        small
          small
            div owner: {{ plot.actualOwner }}
    template(v-slot:footer='')
      div(v-if="ketherNFTLoanerCont")
        div.d-flex.align-items-center(v-if="plot.actualOwner == userAddy")
          div(v-if="!isLoanable")
            a.clickable(
              v-loading="globalLoading"
              :class="isWrapped ? 'text-danger' : 'text-success'"
              @click="isWrapped ? unwrapPlot() : wrapPlot()")
                i.now-ui-icons(:class="isWrapped ? 'files_paper' : 'objects_diamond'")
                | {{ isWrapped ? 'Unwrap' : 'Wrap Plot' }}
          div.ml-auto(v-if="isWrapped")
            a.clickable.text-danger(
              v-if="isLoanable"
              v-loading="globalLoading"
              @click="makeUnloanable")
                i.now-ui-icons.ui-1_simple-remove
                | Remove from loan contract
            a.clickable.text-success(
              v-else
              v-loading="globalLoading"
              data-toggle="modal"
              :data-target="`#make-loanable-modal-${plot.index}`")
                i.now-ui-icons.ui-1_simple-add
                | Make plot loanable
        div.text-right(v-else-if="isLoanable")
          div(v-if="plotHasActiveLoan")
            i Current loan is set to expire at {{ plotLoanExpirationDate }}
          a.clickable.text-success(
            v-else
            data-toggle="modal"
            :data-target="`#loan-plot-modal-${plot.index}`")
              | Loan plot!

make-loanable-modal(
  :id="`make-loanable-modal-${plot.index}`"
  :plot="plot")

loan-plot-modal(
  :id="`loan-plot-modal-${plot.index}`"
  :plot="plot")
</template>
<script>
import $ from "jquery";
import { mapState } from "vuex";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import LoanPlotModal from "./LoanPlotModal";
import MakeLoanableModal from "./MakeLoanableModal";

export default {
  components: {
    LoanPlotModal,
    MakeLoanableModal,
  },

  props: {
    plot: { type: Object, required: true },
  },

  data() {
    return {
      wrapAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      ketherNFTLoanerCont: (_, getters) =>
        getters.activeNetwork.contracts.ketherNFTLoaner,
      userAddy: (state) => state.web3.address,
    }),

    iconClass() {
      return this.isWrapped ? "files_box" : "files_paper";
    },

    type() {
      return this.isWrapped ? "success" : "danger";
    },

    isWrapped() {
      return this.plot.isWrapped;
    },

    isLoanable() {
      return this.plot.isLoanable;
    },

    plotArea() {
      return new BigNumber(this.plot.width)
        .times(10)
        .times(this.plot.height)
        .times(10)
        .toFixed();
    },

    plotHasActiveLoan() {
      return (
        this.plot.loanInfo.end > 0 &&
        dayjs(this.plot.loanInfo.end).isAfter(dayjs())
      );
    },

    plotLoanExpirationDate() {
      return dayjs(this.plot.loanInfo.end).toISOString();
    },
  },

  methods: {
    async wrapPlot() {
      try {
        const { isConfirmed } = await this.wrapAlert.fire({
          title: "<span class='text-danger'>Wrap Plot!</span>",
          html: `
              <div class="mb-4">
                We will now wrap your plot into an NFT that will
                show up in OpenSea and can be used to loan/lease out to others
                for ad space.
              </div>
              </div>
                You will see two blockchain transactions back-to-back in order to
                wrap your plot. Please confirm both which will complete the wrapping
                process.
              </div>
            `,
          confirmButtonText: "Yes, wrap my plot!",
          cancelButtonText: "Cancel",
          showCancelButton: true,
        });
        if (!isConfirmed) return;

        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("wrapKetherPlot", this.plot.index);
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully wrapped your plot into an NFT!`);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async unwrapPlot() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("unwrapKetherPlot", this.plot.index);
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully unwrapped your plot!`);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async makeUnloanable() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch(
          "removeKetherPlotFromLoanable",
          this.plot.index
        );
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(
          `Successfully removed your plot from being loanable!`
        );
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  beforeUnmount() {
    $(`#loan-plot-modal-${this.plot.index}`).remove();
    $(`#make-loanable-modal-${this.plot.index}`).remove();
  },
};
</script>
