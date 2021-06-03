<template lang="pug">
div
  div.d-flex.align-items-center(v-if="userAddress")
    | {{ shortAddy }}
    a.ml-auto(@click.stop="disconnect")
      i.m-0.now-ui-icons.ui-1_simple-remove
  n-button.m-0(
    v-else
    type="danger"
    :round="true"
    @click="reconnect") Connect to your Wallet
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UserAddress",

  computed: {
    ...mapState({
      userAddress: (state) => state.web3.address,
    }),

    shortAddy() {
      const f3 = this.userAddress.slice(0, 6);
      const l3 = this.userAddress.slice(-7, -1);
      return `${f3}...${l3}`;
    },
  },

  methods: {
    disconnect() {
      this.$store.dispatch("disconnect");
    },

    async reconnect() {
      await this.$store.dispatch("init", true);
    },
  },
};
</script>
