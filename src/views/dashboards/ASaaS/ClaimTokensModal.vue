<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='asaas-claim-tokens-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Claim Tokens
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.mb-4
            | Once you initiate a swap and send tokens on one side of the bridge, you can come here
            | to enter your swap information below that was given to you to claim the tokens on the receiving side.
          //- label Please enter your swap information here to claim your tokens
          label Swap ID
          fg-input(
            type="text"
            plceholder="Swap ID"
            v-model="swapId")
          label Unique Identifier
          fg-input(
            type="number"
            plceholder="Unique Identifier"
            v-model="timestamp")
          label Amount of Tokens Your Swapping
          fg-input(
            type="text"
            plceholder="Amount Tokens"
            v-model="amountTokens")
          div.mt-3
            | When you claim your tokens you will also send #[strong {{ instanceGasCostEther }} {{ (activeNetwork.native_currency || {}).symbol || 'ETH' }}]
            | to fund the oracle that is executing the swap.
          div.mt-3.d-flex.align-items-center.justify-content-center
            n-button(
              type="primary"
              :disabled="globalLoading"
              v-loading="globalLoading"
              @click="claimTokens") Claim Your Tokens Now
</template>

<script>
import $ from "jquery";
// import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
export default {
  name: "ClaimTokensModal",

  props: {
    swap: { type: Object, default: null },
  },

  data() {
    return { amountTokens: null, swapId: null, timestamp: null };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      createSwapCost: (state) => state.asaas.createSwapCost,
      globalLoading: (state) => state.globalLoading,
      gasRequirement: (state) => state.asaas.gas,
      web3: (state) => state.web3.instance || {},
      instanceGasCost(state) {
        return state.asaas.instanceGasCost[this.swap.sourceContract];
      },
    }),

    instanceGasCostEther() {
      return this.web3.utils.fromWei(this.instanceGasCost || "0", "ether");
    },
  },

  methods: {
    async claimTokens() {
      try {
        if (!(this.swapId && this.timestamp && this.amountTokens)) return;
        this.$store.commit("SET_GLOBAL_LOADING", true);

        this.$toast.info(
          `We're claiming your tokens now. Please be patient as this could take up to several minutes to complete!`
        );
        await this.$store.dispatch("asaasFundAndClaimTokens", {
          instContract: this.swap.sourceContract,
          id: this.swapId,
          timestamp: this.timestamp,
          amount: new BigNumber(this.amountTokens.replace(/,/g, ""))
            .times(
              new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals)
            )
            .toFixed(),
        });

        this.$toast.success(`Successfully claimed your tokens!`);
        localStorage.removeItem("mtgyAsaasLatestSwapId");
        localStorage.removeItem("mtgyAsaasLatestSwapTimestamp");
        localStorage.removeItem("mtgyAsaasLatestSwapNumTokens");
        await this.$store.dispatch("getAllSwapContracts");
        $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        console.error("Error claiming tokens", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  mounted() {
    $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
      if (localStorage.mtgyAsaasLatestSwapId) {
        this.swapId = localStorage.mtgyAsaasLatestSwapId;
        this.timestamp = localStorage.mtgyAsaasLatestSwapTimestamp;
        this.amountTokens = localStorage.mtgyAsaasLatestSwapNumTokens;
      }
    });
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
