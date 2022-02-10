<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='add-remove-stake-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Create Buybot
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="isLoadingLocal")
          div.text-center(v-else)
            div
              token-input-standalone.mb-4(
                v-model="tokenInfo"
                :btn-text="`Token Contract Address on ${activeNetwork.name}`")
              //- div.text-left
              //-   label Number of tokens for your swap contract to hold:
              //- fg-input(
              //-   type="number"
              //-   placeholder="Number of tokens for your bridge to hold"
              //-   v-model="numberTokens")
              
              //- card
              //-   checkbox.mb-3(
              //-     v-model="createdFirstAlready"
              //-     @update:modelValue="getTargetTokenInfo")
              //-       | Have you already created the first swap contract?
              //-   div(v-if="createdFirstAlready")
              //-     fg-input.mb-2(
              //-       type="text"
              //-       placeholder="First swap contract"
              //-       v-model="contractAddress"
              //-       @update:modelValue="getTargetTokenInfo")
              //-     fg-input.mb-2(
              //-       type="number"
              //-       placeholder="First swap unique identifier"
              //-       v-model="timestamp")
              //-     div.text-left(v-if="targetTokenInfo")
              //-       div #[strong Token Contract:] {{ targetTokenInfo.targetTokenAddress }}
              //-       div #[strong Token:] {{ targetTokenInfo.targetTokenName }} ({{ targetTokenInfo.targetTokenSymbol }})
              //-       div #[strong Decimals:] {{ targetTokenInfo.targetTokenDecimals }}

              //- div
              //-   div.text-danger
              //-     | You will spend #[strong {{ createSwapCost }} {{ nativeCurrencySymbol }}] on both sides to create your atomic swap bridge.
              //-   n-button(
              //-     type="success"
              //-     size="lg"
              //-     v-loading="globalLoading"
              //-     :disabled="loadingOrNotValidated"
              //-     @click="createSwap") Create {{ tokenInfo && tokenInfo.symbol || 'Token' }} Swap

              //- div.mt-3(v-if="contractAddress")
              //-   div.alert.alert-danger.text-center
              //-     h4.m-0 Attention: Write Down the Following Info
              //-     div.mb-4
              //-       | Your atomic swap contract was created successfully! You will need to copy the following in order
              //-       | to link your atomic swap contracts together.
              //-     div.mb-4
              //-       | After you write these down, switch networks to the target network where you will
              //-       | create the final swap contract.
              //-     div Contract address: #[strong {{ contractAddress }}]
              //-     div Unique identifier: #[strong {{ timestamp }}]
</template>

<script>
import $ from "jquery";
// import dayjs from "dayjs";
// import BigNumber from "bignumber.js";
import { mapState } from "vuex";
export default {
  name: "CreateBuybotModal",

  props: {
    // farmAddress: { type: String, default: null },
  },

  // emits: ["staked"],

  data() {
    return {
      isLoadingLocal: false,
      tokenInfo: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      createSwapCost: (state) => state.asaas.createSwapCost,
      globalLoading: (state) => state.globalLoading,
      mtgyServiceCost: (state) => state.asaas.cost,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
      gasRequirement: (state) => state.asaas.gas,
      web3: (state) => state.web3.instance,
      userAddress: (state) => state.web3.address,
      zeroAddy: (state) => state.zeroAddy,
    }),
  },

  methods: {
    async createSwap() {
      try {
        // $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        console.error("Error creating swap", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async mounted() {
    // $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
    //   this.tokenInfo = null;
    //   this.numberTokens = 0;
    //   this.maxSwap = 0;
    //   this.targetNetwork = null;
    // });
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
