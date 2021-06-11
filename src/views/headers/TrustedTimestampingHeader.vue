<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Blockchain Trusted Timestamping
    p.category
      | Upload files of any size to capture its SHA 256 hash/signature and store
      | it in the blockchain to validate later the source of truth has not been
      | tampered with.
    span.category.link(data-toggle="modal", data-target="#faq-modal")
      | #[router-link(to="") #[i.fa.fa-question-circle] Learn More]
faq-modal#faq-modal
</template>

<script>
import FaqModal from "@/components/TrustedTimestamping/FaqModal";

export default {
  components: {
    FaqModal,
  },
};
</script>

<style scoped>
.category {
  text-transform: inherit;
}

.link {
  cursor: pointer;
}
</style>
