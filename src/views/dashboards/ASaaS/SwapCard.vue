<template lang="pug">
card.card-pricing(no-footer-line='' :category="activeNetwork.name")
  .card-icon.icon-primary.p-0
    //- i.now-ui-icons.objects_diamond
    img.img-fluid(
      style="max-width: 30px; height: auto"
      :src="activeNetworkLogo")
  h3.card-title.mb-0 {{ swap.token.symbol }}
  div.text-secondary.mb-3
    small {{ swap.token.name }}
  ul
    //- li {{ swap.sourceContract }}
    li
      div
        strong Your Balance
      div {{ userBalance(swap.token) }}
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
      div.mr-2
        n-button(
          type='primary'
          round=''
          data-toggle="modal"
          :data-target="`#swap-send-modal-${swap.sourceContract}`") Send Tokens to Swap
      div
        n-button(
          type='success'
          round='') Claim Tokens

.modal.fade(
  :id="`swap-send-modal-${swap.sourceContract}`"
  tabindex='-1'
  role='dialog'
  aria-labelledby='asaas-send-tokens-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Send Tokens
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          label How many tokens do you want to swap?
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
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
export default {
  props: {
    swap: { type: Object },
  },

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
      web3: (state) => state.web3.instance,
    }),

    instanceGasCostEther() {
      return this.web3.utils.fromWei(this.instanceGasCost || "0", "ether");
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

    userBalance(tokenInfo) {
      return new BigNumber(tokenInfo.userBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFormat(4);
    },

    async sendTokensToSwap() {
      try {
        if (!this.sendTokenAmount) return;
        this.$store.commit("SET_GLOBAL_LOADING", true);
        const decimals = this.swap.token.decimals;
        await this.$store.dispatch("sendTokensToSwap", {
          amount: new BigNumber(this.sendTokenAmount)
            .times(new BigNumber(10).pow(decimals))
            .toFixed(0),
          sourceContract: this.swap.sourceContract,
          tokenContract: this.swap.token.address,
        });
        this.latestSwap = await this.$store.dispatch(
          "asaasGetLatestUserSwap",
          this.swap.sourceContract
        );
        console.log("LATEST", this.latestSwap);
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
