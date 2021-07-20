<template lang="pug">
card.card-pricing(no-footer-line='' :category="swap.sourceContract")
  .card-icon.icon-primary.p-0
    //- i.now-ui-icons.objects_diamond
    img.img-fluid(
      style="max-width: 30px; height: auto"
      :src="activeNetworkLogo")
  h3.card-title.mb-0 {{ swap.token.symbol }}
  div.text-secondary.mb-3
    small {{ swap.token.name }}
  ul
    li
      small 
        div
          strong Your Balance
        div {{ userBalance(swap.token) }}
        div
          strong Swap Contract Balance
        div {{ contractBalance(swap.token) }}
    li
      img.img-fluid(
        style="max-width: 30px; height: auto"
        :src="targetNetworkImg(swap.targetNetwork)")
      div {{ targetNetworkName(swap.targetNetwork) }} token
      div {{ swap.targetToken.targetTokenSymbol }}
      div
        small {{ swap.targetToken.targetTokenName }}
  template(v-slot:footer='')
    div.d-flex.align-items-center.justify-content-center
      div
        n-button(
          type='primary'
          round=''
          data-toggle="modal"
          :data-target="`#swap-send-modal-${swap.sourceContract}`") Initiate New Swap
      //- div.ml-2(v-if="hasUnclaimedTokens")
      div.ml-2
        n-button(
          type='success'
          round=''
          data-toggle="modal"
          :data-target="`#claim-tokens-modal-${swap.sourceContract}`") Claim Tokens

.modal.fade(
  :id="`swap-send-modal-${swap.sourceContract}`"
  tabindex='-1'
  role='dialog'
  aria-labelledby='asaas-send-tokens-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Initiate New Swap
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          h5.mb-4.text-center
            | You're sending tokens from {{ activeNetwork.name }}
            | and will claim them on {{ targetNetworkName(swap.targetNetwork) }}
          label
            | How many #[strong {{ swap.token.symbol }}] do you want to swap? After they are sent
            | here, you can claim the same amount at that point by switching to the target network.
          fg-input(
            type="number"
            v-model="sendTokenAmount")
          div.mt-3
            | When you send your tokens you will also send #[strong {{ instanceGasCostEther }} {{ (activeNetwork.native_currency || {}).symbol || 'ETH' }}]
            | to fund the oracle that is
            | executing the token swap.
          div.mt-3.d-flex.align-items-center.justify-content-center
            n-button(
              type="primary"
              :disabled="globalLoading"
              v-loading="globalLoading"
              @click="sendTokensToSwap") Send Tokens Now
          div.text-danger.text-center.mt-2
            small 
              | You will spend #[strong {{ costFormatted }}] MTGY to use this atomic swap service.
          div.alert.alert-danger.mt-4(v-if="latestSwap")
            h4.text-center.m-0 Attention!
            div
              | Please write the following information down as you'll need it to claim your
              | tokens on the target swap network and contract. After you write this down, you
              | can toggle over to the target network to claim your tokens there.
            ul
              li Swap ID: #[strong {{ latestSwap.id }}]
              li Unique Identifier: #[strong {{ latestSwap.origTimestamp }}]
              li Amount to Send: #[strong {{ numTokensSending }}]

claim-tokens-modal(
  :id="`claim-tokens-modal-${swap.sourceContract}`"
  :swap="swap")
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import ClaimTokensModal from "./ClaimTokensModal";
export default {
  props: {
    swap: { type: Object },
  },

  components: { ClaimTokensModal },

  data() {
    return {
      sendTokenAmount: null,
      latestSwap: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      networks: (state) => state.eth.networks,
      instanceGasCost(state) {
        return state.asaas.instanceGasCost[this.swap.sourceContract];
      },
      mtgyServiceCost: (state) => state.asaas.instanceServiceCost,
      web3: (state) => state.web3.instance,
    }),

    costFormatted() {
      return new BigNumber(this.mtgyServiceCost || 0)
        .div(new BigNumber(10).pow(18))
        .toFormat(0);
    },

    hasUnclaimedTokens() {
      return (
        this.swap.hasUnclaimedTokens &&
        new BigNumber(this.swap.hasUnclaimedTokens.amount).gt(0) &&
        !this.swap.hasUnclaimedTokens.isComplete
      );
    },

    instanceGasCostEther() {
      try {
        return this.web3.utils.fromWei(this.instanceGasCost || "0", "ether");
      } catch (err) {
        return "0";
      }
    },

    numTokensSending() {
      return new BigNumber(this.latestSwap.amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat(2);
    },
  },

  methods: {
    targetNetworkObj(networkShortName) {
      return this.networks.find((n) => n.short_name == networkShortName) || {};
    },

    targetNetworkName(networkShortName) {
      return this.targetNetworkObj(networkShortName).name;
    },

    targetNetworkImg(networkShortName) {
      return this.targetNetworkObj(networkShortName).logo || `img/eth.png`;
    },

    contractBalance(tokenInfo) {
      return new BigNumber(tokenInfo.contractBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFormat(2);
    },

    userBalance(tokenInfo) {
      return new BigNumber(tokenInfo.userBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFormat(2);
    },

    async sendTokensToSwap() {
      try {
        if (!this.sendTokenAmount) return;
        const correctSendTokenAmount = new BigNumber(this.sendTokenAmount)
          .times(new BigNumber(10).pow(this.swap.token.decimals))
          .toFixed(0);
        if (
          new BigNumber(this.swap.token.contractBalance).lt(
            correctSendTokenAmount
          )
        ) {
          throw new Error(`You can't send more than the contract has in it.`);
        }
        this.$store.commit("SET_GLOBAL_LOADING", true);
        const decimals = this.swap.token.decimals;
        await this.$store.dispatch("sendTokensToSwap", {
          amount: correctSendTokenAmount,
          sourceContract: this.swap.sourceContract,
          tokenContract: this.swap.token.address,
        });
        this.latestSwap = await this.$store.dispatch(
          "asaasGetLatestUserSwap",
          this.swap.sourceContract
        );
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async mounted() {
    await this.$store.dispatch(
      "asaasInstanceGasCost",
      this.swap.sourceContract
    );
  },
};
</script>
