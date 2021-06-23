<template lang="pug">
div
  div.alert.alert-danger(v-if="!isConnected")
    | Make sure you connect to your wallet before searching for a token.
  div(v-else)
    div.px-3
      div.alert.alert-danger(v-if="localError")
        | {{ localError.message }}
      //- fg-input(
      //-   placeholder="Token Contract"
      //-   v-model="insertedTokenAddy")
    div.px-3
      input.form-control(
        placeholder="Token Contract"
        v-model="insertedTokenAddy")
    div.text-center
      n-button(
        type="primary"
        :size="btnSize"
        v-loading="globalLoading"
        :disabled="globalLoading"
        @click="selectAndGetToken") {{ btnText }}
    template(v-if="modelValue && modelValue.address")
      hr
      div.row.pb-3
        div.col-4.text-center
          div.text-uppercase Symbol
          h6.m-0 {{ modelValue.symbol }}
        div.col-4.text-center
          div.text-uppercase Token
          h6.m-0 {{ modelValue.name }}
        div.col-4.text-center
          div.text-uppercase Balance
          h6.m-0 {{ tokenUserBalance }}
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";

export default {
  name: "token-input",

  props: {
    modelValue: { type: Object, default: null },
    btnSize: { type: String, default: null },
    btnText: { type: String, default: "Get Token Info" },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      localError: null,
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      isConnected: (state) => state.web3.isConnected,
      web3: (state) => state.web3.instance,
    }),

    insertedTokenAddy: {
      get() {
        return this.modelValue && this.modelValue.address;
      },

      async set(newAddy) {
        this.localError = null;
        if (!this.web3.utils.isAddress(newAddy))
          return this.$emit("update:modelValue", { address: newAddy });
        const newTokenInfo = await this.$store.dispatch(
          "getErc20TokenInfo",
          newAddy
        );
        this.$emit("update:modelValue", newTokenInfo);
      },
    },

    tokenUserBalance() {
      return (
        this.modelValue &&
        this.modelValue.userBalance &&
        new BigNumber(this.modelValue.userBalance)
          .div(new BigNumber(10).pow(this.modelValue.decimals))
          .toFormat(2)
      );
    },
  },

  methods: {
    async selectAndGetToken(allowCleared = false) {
      try {
        const tokenAddy = this.insertedTokenAddy;
        if (!tokenAddy && !allowCleared) return;
        const newTokenInfo = await this.$store.dispatch(
          "getErc20TokenInfo",
          tokenAddy
        );
        this.$emit("update:modelValue", newTokenInfo);
      } catch (err) {
        this.localError = err;
      }
    },
  },

  async mounted() {
    if (!this.isConnected) return;
    if (this.insertedTokenAddy) {
      await this.selectAndGetToken(this.insertedTokenAddy);
    }
  },
};
</script>
