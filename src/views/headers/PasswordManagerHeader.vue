<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Password Manager
    p.category.mb-3
      | Securely store account information &amp; passwords on the blockchain.
    p.category
      | Any information you enter here is encrypted using AES 256 bit encryption in
      | the browser using #[a(href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto" target="_blank" rel="noopener noreferrer") native crypto APIs].
      | All data on the blockchain is encrypted and only decrypted once it's on your machine.
</template>

<script>
export default {};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
