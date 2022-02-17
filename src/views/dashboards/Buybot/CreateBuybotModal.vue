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
            | Create Buybot on {{ activeNetwork.short_name.toUpperCase() }}
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="isLoadingLocal")
          div.text-center(v-else)
            div.text-left
              label.mb-0 {{ activeNetwork.short_name.toUpperCase() }} token contract to create buybot for:
              token-input-standalone.mb-4(
                v-model="tokenInfo"
                :btn-text="`Token Contract Address on ${activeNetwork.name}`")

              card.border
                h5.text-center
                  | Be sure to add bot #[code https://t.me/oklg_buybot] to your
                  | telegram channel with messaging privledges for new buys to show up.
              div.text-left
                label.mb-0 Message Client
                div.mb-3
                  strong Telegram
              div.text-left
                label Telegram channel to post buys to (ex. #[code https://t.me/ok_lg])
                fg-input.mb-2(
                  type="text"
                  placeholder="Telegram Channel"
                  v-model="telegramChannelLink"
                  @update:modelValue="getTelegramChannelId")
                div.mb-4(v-if="telegramChannelId")
                  | Channel ID: #[strong {{ telegramChannelId }}]
              div.text-left
                label Minimum buy amount to show in channel (USD $)
                fg-input.mb-2(
                  type="text"
                  placeholder="Minimum Amount Spent on Buy to Show (USD)"
                  v-model="minThresholdUsd")
              div.text-left
                label When should your buybot expire?
                div(v-if="!isPaid")
                  strong 180 days from now
                el-date-picker(
                  v-else
                  type='datetime'
                  placeholder='Expiration'
                  v-model='expiration')
              div.text-left.mt-3
                label Referrer (optional, if an affiliate recommended this service, enter their address here)
                fg-input.mb-2(
                  type="text"
                  placeholder="Referrer"
                  v-model="referrer")

              div.text-center
                checkbox.mb-2(v-model="isPaid")
                    | Do you want to pay for the ad free version of this buybot as a service?
                div.text-danger.my-3(v-if="isPaid")
                  | You will spend #[strong ${{ dailyBuybotCost }} USD per day] for your buybot to run in your telegram group of choice.
                n-button(
                  type="primary"
                  size="lg"
                  v-loading="globalLoading"
                  :disabled="globalLoading"
                  @click="setupBuybot") Configure Buybot!
                div.alert.alert-info.text-center.mt-2
                  | It could take up to 10-15 minutes before buys for your token begin showing
                  | in your telegram group after adding the bot to your channel.
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
      isPaid: false,
      minThresholdUsd: 25,
      telegramChannelLink: "",
      telegramChannelId: "",
      expiration: dayjs().add(6, "months").toDate(),
      referrer: null,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      globalLoading: (state) => state.globalLoading,
      // nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
      // userAddress: (state) => state.web3.address,
      dailyBuybotCost: (state) => state.buybot.dailyCost,
    }),
  },

  methods: {
    async getTelegramChannelId() {
      if (this.telegramChannelLink) {
        const channel = await Buybot.getTelegramChannelId(
          this.telegramChannelLink
        );
        this.telegramChannelId = channel.id.toString();
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
          isPaid: this.isPaid,
          minThresholdUsd: this.minThresholdUsd,
          referrer: this.referrer,
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
