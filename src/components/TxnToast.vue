<template lang="pug">
div.Vue-Toastification__toast-body Transaction Submitted - #[a(:href="`${activeNetworkExplorerUrl}/tx/${transactionHash}`", target="_blank", rel="noopener noreferrer") View Transaction]
</template>
<script>
export default {
  name: "TxnToast",
  props: {
    transactionHash: String,
    activeNetworkExplorerUrl: String,
  },
};
</script>
<style lang="scss"></style>
