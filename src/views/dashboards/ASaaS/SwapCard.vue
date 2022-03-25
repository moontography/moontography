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
  ul.mb-0
    li
      small 
        div
          strong Your Balance
        div {{ userBalanceFormatted(swap.token) }}
        div
          strong Swap Contract Balance
        div {{ contractBalance(swap.token) }}
    li
      div.mb-2.text-secondary(style="font-size: 0.7142em") {{ swap.targetContract }}
      div.mb-2
          small
            strong Swap Contract Balance
          div
            small {{ targetNetworkSwapTokenBalanceFormatted }}
      img.mb-4.img-fluid(
        style="max-width: 30px; height: auto"
        :src="targetNetworkImg(swap.targetNetwork)")
      div {{ targetNetworkName(swap.targetNetwork) }} token
      template(v-if="swap.targetToken")
        div {{ swap.targetToken.targetTokenSymbol }}
        div
          small {{ swap.targetToken.targetTokenName }}
  template(v-slot:footer='')
    div.alert.alert-danger.text-left(
      v-if="hasUnclaimedSentFromTarget"
      style="font-size: 0.8rem")
        div.mb-3 The following is unclaimed swap info you can use to claim tokens now.
        div
          div
            small Swap ID
          div.mb-1
            strong {{ swap.unclaimedSentFromTarget.id }}
        div
          div
            small Unique Identifier
          div.mb-1
            strong {{ swap.unclaimedSentFromTarget.origTimestamp }}
        div 
          div
            small Amount
          div
            strong {{ formatUnclaimedFromTargetAmount(swap.unclaimedSentFromTarget.amount) }}
    div.d-flex.align-items-center.justify-content-center
      div
        n-button(
          :disabled="globalLoading"
          v-loading="globalLoading"
          type='primary'
          round=''
          data-toggle="modal"
          :data-target="`#swap-send-modal-${swap.sourceContract}`") Initiate Swap
      //- div.ml-2(v-if="hasUnclaimedSentFromSource")
      div.ml-2
        n-button(
          :disabled="globalLoading"
          v-loading="globalLoading"
          type='success'
          round=''
          data-toggle="modal"
          :data-target="`#claim-tokens-modal-${swap.sourceContract}`") Claim Tokens
      div.ml-2(v-if="hasUnclaimedInSourceAndNotInitiatedClaiming")
        n-button(
          :disabled="globalLoading"
          v-loading="globalLoading"
          type='danger'
          round=''
          @click="refundTokens") Refund Tokens

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
          div.text-center.mb-2
            small The contract balance is: {{ contractBalance(swap.token) }} {{ swap.token.symbol }}
          h5.mb-4.text-center
            | You're sending tokens from {{ activeNetwork.name }}
            | and will claim them on {{ targetNetworkName(swap.targetNetwork) }}
          label
            | How many #[strong {{ swap.token.symbol }}] do you want to swap? After they are sent
            | here, you can claim the same amount at that point by switching to the target network.
          
          div.text-center.mt-3
            strong
              div You can swap up to {{ userBalanceFormatted(swap.token) }} {{ swap.token.symbol }}.
              div Use the slider/percent box below to set the amount to swap.
          slider-input-percent(v-model="percAmountToSend")
          div.text-warning.text-center
            div.mt-3
              | When you send your tokens you will also send #[strong {{ instanceGasCostEther }} {{ nativeCurrencySymbol }}]
              | to fund the relay that executes the swap.
            div(v-if="bridgeCostFormatted > 0")
              | You will also send #[strong {{ bridgeCostFormatted }} {{ nativeCurrencySymbol }}] to use this atomic swap service.
          div.mt-3.d-flex.align-items-center.justify-content-center(v-if="!latestSwap")
            n-button(
              v-if="sendTokenAmount && sendTokenAmount > 0"
              type="primary"
              :disabled="globalLoading || !hasEnoughTargetLiquidity"
              v-loading="globalLoading"
              @click="sendTokensToSwap") Send {{ sendTokenAmountFormatted }} Tokens Now
            //- div.text-danger.text-center.mt-3(v-if="!hasEnoughTargetLiquidity")
            //-   | There is not enough target bridge liquidity to serve this bridge request. Please contact the project
            //-   | owners and let them know to add bridge liquidity if you need to execute this request.
          div.alert.alert-danger.mt-4(v-else)
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
  :contract-balance="contractBalance(swap.token)"
  :swap="swap")
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import Swal from "sweetalert2";
import { mapState } from "vuex";
import ClaimTokensModal from "./ClaimTokensModal";
export default {
  props: {
    swap: { type: Object },
  },

  components: { ClaimTokensModal },

  data() {
    return {
      percAmountToSend: 0,
      latestSwap: null,
      refundAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
      networks: (state) => state.eth.networks,
      instanceGasCost(state) {
        return state.asaas.instanceGasCost[this.swap.sourceContract];
      },
      bridgeServiceCost(state) {
        return state.asaas.instanceServiceCost[this.swap.sourceContract];
      },
      web3: (state) => state.web3.instance,
    }),

    bridgeCostFormatted() {
      return new BigNumber(this.bridgeServiceCost || 0)
        .div(new BigNumber(10).pow(18))
        .toFixed();
    },

    hasUnclaimedSentFromSource() {
      return (
        this.swap.unclaimedSentFromSource &&
        new BigNumber(this.swap.unclaimedSentFromSource.amount).gt(0) &&
        !this.swap.unclaimedSentFromSource.isComplete
      );
    },

    hasUnclaimedSentFromTarget() {
      const targetSwap = this.swap.unclaimedSentFromTarget;
      return (
        targetSwap &&
        new BigNumber(targetSwap.amount).gt(0) &&
        !targetSwap.isComplete &&
        !targetSwap.isRefunded
      );
    },

    hasEnoughTargetLiquidity() {
      return (
        this.targetNetworkSwapTokenBalance &&
        this.targetNetworkSwapTokenBalance.gte(this.sendTokenAmount)
      );
    },

    targetNetworkSwapTokenBalance() {
      return (
        this.swap.targetToken &&
        this.swap.targetToken.targetTokenSwapBalance &&
        new BigNumber(this.swap.targetToken.targetTokenSwapBalance).div(
          new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals)
        )
      );
    },

    targetNetworkSwapTokenBalanceFormatted() {
      return (
        this.targetNetworkSwapTokenBalance &&
        this.targetNetworkSwapTokenBalance.toFormat(2)
      );
    },

    hasUnclaimedInSourceAndNotInitiatedClaiming() {
      const sourceSwap = this.swap.unclaimedSentFromSource;
      const targetSwap = this.swap.unclaimedSentFromTarget;
      return (
        sourceSwap &&
        new BigNumber(sourceSwap.amount).gt(0) &&
        !sourceSwap.isComplete &&
        !sourceSwap.isRefunded &&
        (!targetSwap || sourceSwap.id !== (targetSwap || {}).id)
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
        .div(new BigNumber(10).pow(this.swap.token.decimals))
        .toFormat();
    },

    sendTokenAmount() {
      return new BigNumber(this.userBalanceRawWithDecimals(this.swap.token))
        .times(new BigNumber(this.percAmountToSend).div(100))
        .toFixed(Number(this.swap.token.decimals));
    },

    sendTokenAmountFormatted() {
      return new BigNumber(this.sendTokenAmount).toFormat();
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

    formatUnclaimedFromTargetAmount(amount) {
      return new BigNumber(amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat();
    },

    userBalanceRawWithDecimals(tokenInfo) {
      return new BigNumber(tokenInfo.userBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFixed();
    },

    userBalanceFormatted(tokenInfo) {
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
        // if (
        //   new BigNumber(this.swap.token.contractBalance).lt(
        //     correctSendTokenAmount
        //   )
        // ) {
        //   throw new Error(`You can't send more than the contract has in it.`);
        // }
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("sendTokensToSwap", {
          amount: correctSendTokenAmount,
          sourceContract: this.swap.sourceContract,
          tokenContract: this.swap.token.address,
        });
        this.latestSwap = await this.$store.dispatch(
          "asaasGetLatestUserSwap",
          this.swap.sourceContract
        );
        localStorage.mtgyAsaasLatestSwapId = this.latestSwap.id;
        localStorage.mtgyAsaasLatestSwapTimestamp = this.latestSwap.origTimestamp;
        localStorage.mtgyAsaasLatestSwapNumTokens = new BigNumber(
          this.latestSwap.amount
        )
          .div(new BigNumber(10).pow(this.swap.token.decimals))
          .toFormat();
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async refundTokens() {
      try {
        const { isConfirmed } = await this.refundAlert.fire({
          title: "<span class='text-danger'>Refund Tokens?</span>",
          html: `
            <div>
              Are you sure you want to refund your tokens to this network?
              You cannot claim them anymore on the target network.
            </div>
          `,
          confirmButtonText: "Yes, refund my tokens!",
          cancelButtonText: "Cancel, do not refund.",
          showCancelButton: true,
        });
        if (!isConfirmed) return;

        this.$store.commit("SET_GLOBAL_LOADING", true);

        await this.$store.dispatch("asaasRefundTokens", {
          instContract: this.swap.sourceContract,
          id: this.swap.unclaimedSentFromSource.id,
          timestamp: this.swap.unclaimedSentFromSource.origTimestamp,
          amount: this.swap.unclaimedSentFromSource.amount,
        });

        this.$toast.success(`Your tokens were successfully refunded!`);

        await this.$store.dispatch("getAllSwapContracts");
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

    if (
      this.hasUnclaimedSentFromTarget &&
      this.swap.unclaimedSentFromTargetSource &&
      this.swap.unclaimedSentFromTargetSource.isSendGasFunded
    ) {
      this.$toast.info(
        `You have undelivered tokens! We're attempting to send them to you now!`
      );
      await this.$store.dispatch("asaasFundAndClaimTokens", {
        instContract: this.swap.sourceContract,
        id: this.swap.unclaimedSentFromTarget.id,
        timestamp: this.swap.unclaimedSentFromTarget.origTimestamp,
        amount: this.swap.unclaimedSentFromTarget.amount,
      });
    }
  },

  beforeUnmount() {
    $(`#claim-tokens-modal-${this.swap.sourceContract}`).remove();
  },
};
</script>
