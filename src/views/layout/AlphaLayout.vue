<template lang="pug">
div
  loading-panel(v-if="isLoadingLocal")
  div.d-flex.alert.alert-danger(v-else-if="!isConnected")
    div.mx-auto(v-if="!isConnected") Please make sure you are connected to your wallet to proceed.
  card(v-else)
    template(v-if="!isAlphaValidated")
      div.mb-2
        div.alert.alert-info.m-0
          | You will need at least 30,000,000 OKLG in your wallet or staked through
          | the official OKLG website in order to gain access to this functionality.
      div.mb-2
        div.alert.alert-danger.m-0(v-if='triedValidatingAndCouldNot')
          | We could not validate that you have access to alpha as a service.
        div(v-else)
          | Please sign the message below which we use to validate your access to use alpha as a service!
      div
        n-button(
          type="primary"
          @click="signMsg") Sign and Validate AaaS Access
    template(v-else)
      div.table-full-width.table-responsive.pb-0
        n-table.mb-0(
          :columns="tableColumns"
          :data='alphaData')
            template(v-slot:columns)
            template(v-slot:default='row')
              td {{ row.item.type }}
              td {{ row.item.info }}
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoadingLocal: false,
      isAndHasTriedValidating: null,

      tableColumns: [
        { value: "type", text: "Type", classes: "" },
        {
          value: "info",
          text: "Info",
          classes: "",
        },
      ],

      alphaData: [
        { type: "New Token Contract", info: "some stuff" },
        { type: "New Liquidity!", info: "some other stuff" },
      ],
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
    async signMsg() {
      try {
        this.isLoadingLocal = true;
        const info = await this.$store.dispatch(
          "signAndValidateMsg",
          "OKLG Alpha as a Service - The information provided by this service is as is, and I understand I am receiving and will use the information provided by this service at my own risk and that OKLG is not responsible for loss due to actions taken in response to the data or information provided."
        );
        this.isAndHasTriedValidating = info.validated;
        if (info.validated) {
          await this.$store.dispatch("checkAsyncValidated");
        }
      } catch (err) {
        console.error("Error validating signed message", err);
      } finally {
        this.isLoadingLocal = false;
      }
    },
  },

  async mounted() {
    await this.$store.dispatch("checkAsyncValidated");
  },
};
</script>
