<template lang="pug">
router-view

disclaimer-modal#disclaimer-modal(@confirm="confirmDisclaimer")
</template>

<script>
import $ from "jquery";
import DisclaimerModal from "@/components/DisclaimerModal";

export default {
  components: {
    DisclaimerModal,
  },

  methods: {
    confirmDisclaimer() {
      localStorage.faasDisclaimerAcknowlegded = true;
    },
  },

  async created() {
    await this.$store.dispatch("init", true);
  },

  mounted() {
    if (!localStorage.faasDisclaimerAcknowlegded) {
      $(`#disclaimer-modal`).modal("show");
    }
  },
};
</script>
