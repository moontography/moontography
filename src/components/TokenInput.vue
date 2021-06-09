<template lang="pug">
div
  div.alert.alert-danger(v-if="!isConnected")
    | Make sure you connect to your wallet before searching for a contract.
  div(v-else)
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
    //- fg-input(
    //-   placeholder="Token Contract"
    //-   v-model="insertedTokenAddy")
    input.form-control(
      placeholder="Token Contract"
      v-model="insertedTokenAddy")
    div.text-center
      n-button(
        type="primary"
        @click="selectAndGetToken") Get Token Info
    template(v-if="selectedTokenSymbol")
      hr
      div.row
        div.col-4.text-center
          div.text-uppercase Symbol
          h6.m-0 {{ selectedTokenSymbol }}
        div.col-4.text-center
          div.text-uppercase Token
          h6.m-0 {{ selectedTokenName }}
        div.col-4.text-center
          div.text-uppercase Balance
          h6.m-0 {{ selectedTokenUserBalance }}
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";

export default {
  name: "token-input",

  props: {
    value: { type: String, default: null },
  },

  emits: ["input"],

  data() {
    return {
      localError: null,
    };
  },

  computed: {
    ...mapState({
      isConnected: (state) => state.web3.isConnected,
      selectedTokenAddress: (state) => state.selectedAddressInfo.address,
      selectedTokenUserBalance: (state) =>
        new BigNumber(state.selectedAddressInfo.userBalance || 0).toFixed(3),
      selectedTokenName: (state) => state.selectedAddressInfo.name,
      selectedTokenSymbol: (state) => state.selectedAddressInfo.symbol,
    }),

    insertedTokenAddy: {
      get() {
        return this.$store.state.selectedAddressInfo.address;
      },

      set(newAddy) {
        this.localError = null;
        this.$store.commit("SET_SELECTED_ADDRESS", newAddy);
      },
    },
  },

  methods: {
    async selectAndGetToken() {
      try {
        const tokenAddy = this.insertedTokenAddy;
        if (!tokenAddy) return;
        await this.$store.dispatch("setUserInfoForToken", tokenAddy);
        this.$emit("input", tokenAddy);
      } catch (err) {
        this.localError = err;
      }
    },
  },

  async mounted() {
    if (this.value) this.$store.commit("SET_SELECTED_ADDRESS", this.value);
    if (!this.isConnected) return;
    if (this.insertedTokenAddy) {
      this.selectAndGetToken(this.insertedTokenAddy);
    }
  },
};
</script>
