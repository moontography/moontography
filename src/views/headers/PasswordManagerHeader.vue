<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Password Manager
    p.category.mb-3
      | Securely store account information &amp; passwords on the blockchain.
    p.category.mb-3
      | Any information you enter here is encrypted using AES 256 bit encryption in
      | the browser using #[a(href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto" target="_blank" rel="noopener noreferrer") native crypto APIs].
      | All data on the blockchain is encrypted and only decrypted once it's on your machine.
    p.category.text-danger(v-if="!crytoIsSupported")
      | *Browser does not support native crypto APIs. See a list of supported browsers
      | #[a(href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility" target="_blank" rel="noopener noreferrer") here.]
    p.category(v-else-if="!initLoading")
      password-manager-header-key
</template>

<script>
import { mapState } from "vuex";
import Cryptography from "browser-cryptography";
import PasswordManagerHeaderKey from "./PasswordManagerHeaderKey";

export default {
  components: { PasswordManagerHeaderKey },

  computed: {
    ...mapState({
      initLoading: (state) => state.initLoading,
    }),

    crytoIsSupported() {
      return Cryptography().isSupported;
    },
  },
};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
