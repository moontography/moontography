<template lang="pug">
div
  loading-panel(v-if="isLoadingLocal")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
  card(v-else)
    template(v-if="!isAlphaValidated")
      div.mb-4
        div.alert.alert-warning.m-0
          | You will need at least 30,000,000 OKLG in your wallet or staked through
          | the official OKLG website in order to gain access to this functionality.
      div
        div.alert.alert-danger.mb-2(v-if='triedValidatingAndCouldNot')
          | We could not validate that you have access to alpha as a service.
        div(v-else)
          | Please sign the message below which we use to validate your access to use alpha as a service!
      div
        n-button(
          type="primary"
          @click="signMsg") Sign and Validate AaaS Access
    template(v-else)
      div.mb-2
        i Data refreshes every 10 seconds.
      div.table-full-width.table-responsive.pb-0
        n-table.mb-0(
          :columns="tableColumns"
          :data='alphaData')
            template(v-slot:columns)
            template(v-slot:default='row')
              td {{ row.item.index + 1 }}.
              td {{ row.item.network }}
              td
                a(
                  :href="unescapeLink(row.item.transactionUrl)"
                  target="_blank"
                  rel="noopener noreferrer") {{ row.item.type }}
              td
                div(v-if="row.item.type === 'New LP Added'")
                  div
                    a(:href="row.item.token0Info.link" target="_blank" rel="noopener noreferrer") {{ row.item.token0Info.symbol }}
                    span &nbsp;/&nbsp; 
                    a(:href="row.item.token1Info.link" target="_blank" rel="noopener noreferrer") {{ row.item.token1Info.symbol }}
                  div.mt-1 LP added (USD): #[b ${{ parseMoney(row.item.lpAddedUSD) }}]
                div(v-else)
                  a(
                    :href="unescapeLink(row.item.tokenLink)"
                    target="_blank"
                    rel="noopener noreferrer")
                      | {{ unescapeText(row.item.tokenName) }}
                      | ({{ unescapeText(row.item.tokenSymbol) }})
              td
                a(
                  :href="unescapeLink(row.item.deployerLink)"
                  target="_blank"
                  rel="noopener noreferrer") {{ row.item.deployer }}
              td {{ row.item.isVerified ? 'Yes' : '' }}
              td
                n-button(
                  type="primary"
                  size="sm"
                  @click="honeypotCheck(row.item.type === 'New LP Added' ? row.item.token0Info.address : row.item.tokenAddress)")
                    | Check Now
              td {{ parseTimestamp(row.item.timestamp) }}
</template>

<script>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";
import AlphaUtils from "@/factories/AlphaUtils";

export default {
  data() {
    return {
      isLoadingLocal: false,
      isAndHasTriedValidating: null,
      refreshInterval: null,
      refreshIntervalTime: 10000,

      tableColumns: [
        { value: "index", text: "#", classes: "" },
        { value: "network", text: "Network", classes: "" },
        { value: "type", text: "Description", classes: "" },
        {
          value: "tokenAddress",
          text: "Contract/Token",
          classes: "",
        },
        {
          value: "deployer",
          text: "Deployer/Owner",
          classes: "",
        },
        { value: "verification", text: "Verified?" },
        { value: "honeypot", text: "Honeypot Check" },
        { value: "timestamp", text: "Date", classes: "" },
      ],

      alphaData: [],
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      isConnected: (_, getters) => getters.isConnected,
      isAlphaValidated: (state) => state.alpha.isValidated,
    }),

    triedValidatingAndCouldNot() {
      return (
        typeof this.isAndHasTriedValidating === "boolean" &&
        !this.isAndHasTriedValidating
      );
    },
  },

  methods: {
    parseMoney(text) {
      return new BigNumber(text).toFormat(2);
    },

    parseTimestamp(time) {
      return dayjs(time * 1000).format("MMM Do, YYYY hh:mm a");
    },

    unescapeLink(link) {
      return link.replace(/\\/g, "");
    },

    unescapeText(text) {
      return text.replace(/[\\]/g, "");
    },

    async getAlpha() {
      this.alphaData = await this.$store.dispatch("getLatestAlpha");
    },

    removeRefreshInterval() {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    },

    async honeypotCheck(contract) {
      const canBuyAndSell = await AlphaUtils.honeypotCheck(
        this.activeNetwork.short_name,
        contract
      );
      if (canBuyAndSell) {
        this.$toast.success(`You can buy and sell this token!`);
      } else {
        this.$toast.error(
          `It appears you currently cannot buy and subsequently sell this token. Check it has adequate liquidity and trading is turned on, and try again.`
        );
      }
    },

    async startRefreshInterval() {
      await this.getAlpha();
      this.refreshInterval = setInterval(
        () => this.getAlpha(),
        this.refreshIntervalTime
      );
    },

    async signMsg() {
      try {
        this.isLoadingLocal = true;
        const info = await this.$store.dispatch(
          "signAndValidateMsg",
          "OKLG Alpha as a Service - The information provided by this service is as is, and I understand I am receiving and will use the information provided by this service at my own risk and that OKLG is not responsible for loss due to actions taken in response to the data or information provided."
        );
        this.isAndHasTriedValidating = info.validated;
        if (info.validated) {
          await this.$store.dispatch("checkAlphaValidated");
        }
        if (this.isAlphaValidated) {
          await this.startRefreshInterval();
        }
      } catch (err) {
        console.error("Error validating signed message", err);
      } finally {
        this.isLoadingLocal = false;
      }
    },
  },

  async mounted() {
    await this.$store.dispatch("checkAlphaValidated");
    if (this.isAlphaValidated) {
      await this.startRefreshInterval();
    }
  },
};
</script>
