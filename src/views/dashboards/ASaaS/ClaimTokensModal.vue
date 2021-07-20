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
            type="number"
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
// import $ from "jquery";
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
      web3: (state) => state.web3.instance,
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

        await this.$store.dispatch("fundAndClaimTokens", {
          instContract: this.swap.sourceContract,
          id: this.swapId,
          timestamp: this.timestamp,
          amount: new BigNumber(this.amountTokens).times(
            new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals)
          ),
        });

        this.$toast.success(`Successfully claimed your tokens!`);
        await this.$store.dispatch("getAllSwapContracts");
        // $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        console.error("Error staking tokens", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },
};
</script>
