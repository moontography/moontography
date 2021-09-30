<template lang="pug">
.row
  .col-md-10.mx-auto
    card.p-2
      h3.m-0 #[i.fa.fa-address-book.text-primary.mr-2] Raffler/Lottery

      .card-body
        div testing 123
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoading: true,
    };
  },

  props: {
    raffleId: { type: String, default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      // accounts: (state) => state.passwordManager.accounts || [],
    }),
  },

  async created() {
    try {
      // await this.$store.dispatch("getPasswordManagerEncryptionKey");
      // await this.$store.dispatch("getPasswordManagerAccounts");
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
