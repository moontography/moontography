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

              template(v-if="tokenInfo && tokenInfo.address")
                div.text-left
                  label.mb-0 Message Client
                  div.mb-3
                    strong Telegram
                div.text-left
                  label Telegram Channel
                  fg-input.mb-2(
                    type="text"
                    placeholder="Telegram Channel"
                    v-model="telegramChannelLink"
                    @update:modelValue="getTelegramChannelId")
                  div.mb-4(v-if="telegramChannelId")
                    | Channel ID: #[strong {{ telegramChannelId }}]
                div.text-left
                  label Minimum Buy to Show (USD)
                  fg-input.mb-2(
                    type="text"
                    placeholder="Minimum Amount Spent on Buy to Show (USD)"
                    v-model="minThresholdUsd")
                div.text-left
                  label When should this configuration expire?
                  el-date-picker(
                    type='datetime'
                    placeholder='Expiration'
                    v-model='expiration')

                div
                  //- div.text-danger
                  //-   | You will spend #[strong {{ createSwapCost }} {{ nativeCurrencySymbol }}] on both sides to create your atomic swap bridge.
                  n-button(
                    type="success"
                    size="lg"
                    v-loading="globalLoading"
                    :disabled="globalLoading"
                    @click="setupBuybot") Configure Buybot!
</template>

<script>
import $ from "jquery";
import dayjs from "dayjs";
// import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import Buybot from "../../../factories/Buybot";
export default {
  name: "CreateBuybotModal",

  emits: ["setup"],

  data() {
    return {
      isLoadingLocal: false,
      tokenInfo: null,
      minThresholdUsd: 25,
      telegramChannelLink: "",
      telegramChannelId: "",
      expiration: dayjs().add(3, "months").toDate(),
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
    async getTelegramChannelId() {
      if (this.telegramChannelLink) {
        const channelId = await Buybot.getTelegramChannelId(
          this.telegramChannelLink
        );
        this.telegramChannelId = channelId.toString();
      }
    },

    async setupBuybot() {
      try {
        if (!(this.tokenInfo.address && this.telegramChannelId)) {
          return this.$toast.error(
            `Please ensure all fields are filled out to configure your buybot.`
          );
        }
        await this.$store.dispatch("setupBuybot", {
          token: this.tokenInfo.address,
          client: "telegram",
          channel: this.telegramChannelId,
          isPaid: true,
          minThresholdUsd: this.minThresholdUsd,
          referrer: null,
          expiration: this.expiration,
        });
        this.$emit("setup");
        $(`#${this.$el.id}`).modal("hide");
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

<style>
.el-picker__popper {
  z-index: 10001 !important;
}
</style>
