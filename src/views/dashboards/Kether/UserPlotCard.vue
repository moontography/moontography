<template lang="pug">
card.card-contributions(
  :title="`${plot.index}`"
  :sub-title='plot.title || "No title yet!"')
    a(
      v-if="plot.image"
      :href="plot.link"
      target="_blank"
      rel="noopener noreferrer")
        img(
          :style="{borderRadius: '0px', width: `${plot.width * 10}px`, height: `${plot.height * 10}px`}"
          :src="plot.image")
    h3.mt-2.mb-0 {{ `${ plot.width * 10 }x${ plot.height * 10 } px` }}
    div.text-secondary
      small x: {{ plot.x }} - y: {{ plot.y }}
    template(v-slot:footer='')
      .row
        .col(v-if="!isLoanable")
          .card-stats.justify-content-center.p-2
            //- n-switch(
            //-   v-model="isWrapped"
            //-   color="success"
            //-   on-text='YES'
            //-   off-text='NO')
            //- span Wrapped?
            n-button.btn-danger(
              v-if="isWrapped"
              v-loading="globalLoading"
              :disabled="globalLoading"
              @click="unwrapPlot") Unwrap Plot
            n-button.btn-success(
              v-else
              v-loading="globalLoading"
              :disabled="globalLoading"
              @click="wrapPlot") Wrap Plot (Generate NFT)
        .col(v-if="isWrapped")
          .card-stats.justify-content-center.p-2
            //- n-switch(
            //-   v-model="isLoanable"
            //-   on-text='YES'
            //-   off-text='NO')
            //- span Loanable?
            n-button.btn-danger(
              v-if="isLoanable"
              v-loading="globalLoading"
              :disabled="globalLoading"
              @click="makeUnloanable") Remove from Loan Contract
            n-button.btn-success(
              v-else
              v-loading="globalLoading"
              :disabled="globalLoading"
              @click="makeLoanable") Make Loanable
</template>
<script>
import { mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  props: {
    plot: { type: Object, required: true },
  },

  data() {
    return {
      loanAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),

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
    }),

    isWrapped: {
      get() {
        return this.plot.isWrapped;
      },

      set(isWrappedNow) {
        console.log("WRAPPED", isWrappedNow);
      },
    },

    isLoanable: {
      get() {
        return this.plot.isLoanable;
      },

      set(isLoanableNow) {
        console.log("LOANED", isLoanableNow);
      },
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

    async makeLoanable() {
      try {
        const { isConfirmed } = await this.wrapAlert.fire({
          title: "<span class='text-danger'>Make Plot Loanable!</span>",
          html: `
              <div>
                This process will stake your plot in a loan contract which will
                manage loans/leases of your plot and send you proceeds of loans
                of your plot. You can remove your plot from this contract at any time.
              </div>
            `,
          confirmButtonText: "Yes, make my plot loanable!",
          cancelButtonText: "Cancel",
          showCancelButton: true,
        });
        if (!isConfirmed) return;

        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("makeKetherPlotLoanable", this.plot.index);
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully made your plot loanable!`);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async makeUnloanable() {},
  },
};
</script>
