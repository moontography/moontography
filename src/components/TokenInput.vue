<template lang="pug">
div
  div.alert.alert-danger(v-if="!isConnected")
    | Make sure you connect to your wallet before searching for a contract.
  div(v-else)
    div
      div.alert.alert-danger(v-if="localError")
        | {{ localError.message }}
      //- fg-input(
      //-   placeholder="Token Contract"
      //-   v-model="insertedTokenAddy")
    div
      input.form-control(
        placeholder="Token Contract Address"
        v-model="insertedTokenAddy"
        @update:modelValue="checkAndClear")
    //- div.text-center
    //-   n-button(
    //-     type="primary"
    //-     :size="btnSize"
    //-     v-loading="globalLoading"
    //-     :disabled="globalLoading"
    //-     @click="selectAndGetToken") {{ btnText }}
    template(v-if="selectedTokenSymbol")
      hr
      div.row.pb-3
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
    modelValue: { type: String, default: null },
    btnSize: { type: String, default: null },
    btnText: { type: String, default: "Get Token Info" },
  },

  emits: ["clear", "update:modelValue"],

  data() {
    return {
      localError: null,
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
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
    async checkAndClear() {
      // if (!this.insertedTokenAddy || this.insertedTokenAddy.length === 0)
      //   await this.selectAndGetToken(true);
    },

    async selectAndGetToken(allowCleared = false) {
      try {
        const tokenAddy = this.insertedTokenAddy;
        if (!tokenAddy && !allowCleared) return;
        await this.$store.dispatch("setUserInfoForToken", tokenAddy);
        this.$emit("update:modelValue", tokenAddy);
      } catch (err) {
        this.localError = err;
      }
    },
  },

  async mounted() {
    if (this.modelValue)
      this.$store.commit("SET_SELECTED_ADDRESS", this.modelValue);
    if (!this.isConnected) return;
    if (this.insertedTokenAddy) {
      this.selectAndGetToken(this.insertedTokenAddy);
    }
  },
};
</script>
