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
            | Create Atomic Swap
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="isLoadingLocal")
          div.text-center(v-else)
            div.mb-4
              div.mb-4
                div.mb-2
                  | Creating a new atomic swap bridge using the OKLG platform allows for your users
                  | to swap tokens 1-to-1 between supported networks.
                div.text-danger
                  //- strong
                  | If your token has special tokenomics that takes out taxes/fees on transfer, ensure you either
                  | exclude your new atomic swap contract from these fees or
                  | ensure your users know they will be taken out when swapping.
              div.text-left
                small 
                  div The process to create an atomic swap is as follows:
                  ol
                    li
                      | Using this form, you will create a new smart contract on the {{ activeNetwork.name }}
                      | network which will hold your tokens for users to swap.
                    li
                      | After the contract is created, you will copy a unique identifier that you'll paste after
                      | switching to the other network where your swap will occur.

            div
              token-input-standalone.mb-4(
                v-model="tokenInfo"
                :btn-text="`Token Contract Address on ${activeNetwork.name}`")
              div.text-left
                label Number of tokens for your swap contract to hold:
              fg-input(
                type="number"
                placeholder="Number of tokens for your bridge to hold"
                v-model="numberTokens")
              div.text-left
                label Maximum number of tokens that can be swapped at once (empty or 0 means no max):
              fg-input.mb-2(
                type="number"
                placeholder="Maximum number of tokens to swap"
                v-model="maxSwap")
              div.text-left
                label.m-0 Current bridge network:
              div.text-left.mb-3
                strong {{ activeNetwork.name }}
              div.text-left
                label.m-0 Target bridge network:
              network-selector.mb-4(
                v-model="targetNetwork"
                @update:modelValue="getTargetTokenInfo")
              
              card
                checkbox.mb-3(
                  v-model="createdFirstAlready"
                  @update:modelValue="getTargetTokenInfo")
                    | Have you already created the first swap contract?
                div(v-if="createdFirstAlready")
                  fg-input.mb-2(
                    type="text"
                    placeholder="First swap contract"
                    v-model="contractAddress"
                    @update:modelValue="getTargetTokenInfo")
                  fg-input.mb-2(
                    type="number"
                    placeholder="First swap unique identifier"
                    v-model="timestamp")
                  div.text-left(v-if="targetTokenInfo")
                    div #[strong Token Contract:] {{ targetTokenInfo.targetTokenAddress }}
                    div #[strong Token:] {{ targetTokenInfo.targetTokenName }} ({{ targetTokenInfo.targetTokenSymbol }})
                    div #[strong Decimals:] {{ targetTokenInfo.targetTokenDecimals }}

              div
                div.text-danger
                  | You will spend #[strong {{ createSwapCost }} {{ nativeCurrencySymbol }}] on both sides to create your atomic swap bridge.
                n-button(
                  type="success"
                  size="lg"
                  v-loading="globalLoading"
                  :disabled="loadingOrNotValidated"
                  @click="createSwap") Create {{ tokenInfo && tokenInfo.symbol || 'Token' }} Swap

              div.mt-3(v-if="contractAddress")
                div.alert.alert-danger.text-center
                  h4.m-0 Attention: Write Down the Following Info
                  div.mb-4
                    | Your atomic swap contract was created successfully! You will need to copy the following in order
                    | to link your atomic swap contracts together.
                  div.mb-4
                    | After you write these down, switch networks to the target network where you will
                    | create the final swap contract.
                  div Contract address: #[strong {{ contractAddress }}]
                  div Unique identifier: #[strong {{ timestamp }}]
</template>

<script>
import $ from "jquery";
// import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import AtomicSwapOracle from "../../../factories/AtomicSwapOracle";
export default {
  name: "AddRemoveStakeModal",

  props: {
    farmAddress: { type: String, default: null },
    isExpired: { type: Boolean, default: false },
  },

  emits: ["staked"],

  watch: {
    activeNetwork: {
      async handler(val) {
        if (val && val.contracts) await this.init();
      },
      deep: true,
    },
  },

  data() {
    return {
      isLoadingLocal: true,
      tokenInfo: null,
      numberTokens: 0,
      maxSwap: 0,
      targetNetwork: null,
      timestamp: null,
      contractAddress: null,
      isContractCached: false,
      createdFirstAlready: false,
      targetTokenInfo: null,
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

    loadingOrNotValidated() {
      return this.globalLoading || !(this.tokenInfo && this.targetNetwork);
    },
  },

  methods: {
    // getRewardsTokens(amount) {
    //   return new BigNumber(amount)
    //     .div(new BigNumber(10).pow(this.stakingInfo.rewardsTokenInfo.decimals))
    //     .toFormat();
    // },

    async init() {
      try {
        if (this.activeNetwork) await this.$store.dispatch("asaasCosts");
        if (this.contractAddress) this.isContractCached = true;
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.isLoadingLocal = false;
      }
    },

    async getTargetTokenInfo() {
      try {
        if (
          !(
            this.targetNetwork &&
            this.web3.utils.isAddress(this.contractAddress)
          )
        )
          return;
        this.targetTokenInfo = await AtomicSwapOracle.getTokenInfoFromSwap({
          targetNetwork: this.targetNetwork,
          targetContract: this.contractAddress,
        });
      } catch (err) {
        this.$toast.error(err.message);
      }
    },

    async createSwap() {
      try {
        if (
          !(
            (this.maxSwap ||
              (typeof this.maxSwap === "number" && this.maxSwap >= 0)) &&
            this.targetNetwork
          )
        ) {
          throw new Error("Please fill out ALL fields to create your bridge.");
        }

        const selectedTargetContract =
          (this.createdFirstAlready && this.contractAddress) || this.zeroAddy;
        let selectedTargetContDecimals = 0;
        if (this.targetTokenInfo && this.targetTokenInfo.targetTokenDecimals) {
          selectedTargetContDecimals = this.targetTokenInfo.targetTokenDecimals;
        }

        this.$store.commit("SET_GLOBAL_LOADING", true);
        const {
          id,
          timestamp,
          index,
          creator,
          sourceContract,
          targetNetwork,
          targetContract,
          targetDecimals,
          isActive,
        } = await this.$store.dispatch("asaasCreateSwap", {
          tokenAddress: this.tokenInfo.address,
          tokenSupply: new BigNumber(this.numberTokens)
            .times(new BigNumber(10).pow(this.tokenInfo.decimals))
            .toFixed(),
          maxSwapAmount: new BigNumber(this.maxSwap)
            .times(new BigNumber(10).pow(this.tokenInfo.decimals))
            .toFixed(),
          targetNetwork: this.targetNetwork,
          targetContract: selectedTargetContract,
          targetDecimals: selectedTargetContDecimals,
        });
        await AtomicSwapOracle.createSwap({
          sourceTimestamp: timestamp,
          sourceNetwork: this.activeNetwork.short_name,
          sourceContract: sourceContract,
          targetTimestamp: (this.createdFirstAlready && this.timestamp) || 0,
          targetContract:
            (this.createdFirstAlready && this.contractAddress) ||
            targetContract,
        });
        this.timestamp = localStorage.mtgyAsaasTimestamp = timestamp;
        this.contractAddress = localStorage.mtgyAsaasContract = sourceContract;
        if (this.isContractCached) {
          localStorage.removeItem("mtgyAsaasTimestamp");
          localStorage.removeItem("mtgyAsaasContract");
        }

        this.$toast.success(`Successfully created your new swap!`);
        await this.$store.dispatch("getAllSwapContracts");
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
    this.timestamp = localStorage.mtgyAsaasTimestamp;
    this.contractAddress = localStorage.mtgyAsaasContract;
    if (this.activeNetwork && this.activeNetwork.contracts) await this.init();

    $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
      this.tokenInfo = null;
      this.numberTokens = 0;
      this.maxSwap = 0;
      this.targetNetwork = null;
    });
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
