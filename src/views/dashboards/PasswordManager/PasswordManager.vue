<template lang="pug">
.row
  .col-md-6.mx-auto
    card.p-2(v-if="encryptionKey")
      div.d-flex.align-items-center.mb-2
        h3.m-0 #[i.fa.fa-address-book.text-primary.mr-2] Your Accounts
        div.ml-auto
          button.btn.btn-primary(
            data-toggle="modal"
            data-target="#password-account-modal-add") #[i.fa.fa-plus-circle.mr-2] Add Account
      input.form-control(
        placeholder="Search accounts.."
        v-model="accountSearch")

      .card-body
        .text-center(v-if="isLoading")
          loading-panel

        div.mt-2(v-else-if="filteredAccounts && filteredAccounts.length > 0")
          router-link(
            v-for="account in filteredAccounts"
            :to="`/passwords/${account.id}`")
              card.clickable(:class="`${accountId == account.id ? 'active' : ''}`")
                div.d-flex.align-items-center
                  i.now-ui-icons.users_circle-08.mr-2
                  h5.m-0
                    b {{ account.name }}
                div(v-if="account.username") #[i.now-ui-icons.business_badge.mr-2] {{ account.username }}
                div(v-if="account.info") #[i.now-ui-icons.travel_info.mr-2] {{ account.info }}

        .text-center.mt-2(v-else)
          i No accounts added to the blockchain yet!

  .col-md-6(v-if="activeAccount")
    active-account-card(:account="activeAccount")

password-account-modal#password-account-modal-add
</template>

<script>
import { mapState } from "vuex";
import ActiveAccountCard from "./ActiveAccountCard";
import PasswordAccountModal from "./PasswordAccountModal";

export default {
  components: {
    ActiveAccountCard,
    PasswordAccountModal,
  },

  data() {
    return {
      isLoading: true,
      accountSearch: "",
    };
  },

  props: {
    accountId: { type: [Number, String], default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
      accounts: (state) => state.passwordManager.accounts || [],
      encryptionKey: (state) => state.passwordManager.encryptionKey,
    }),

    filteredAccounts() {
      return this.accounts.filter((a) => {
        return (
          (a.name &&
            a.name.toLowerCase().includes(this.accountSearch.toLowerCase())) ||
          (a.username &&
            a.username.toLowerCase().includes(this.accountSearch.toLowerCase()))
        );
      });
    },

    activeAccount() {
      return this.accounts.find((a) => this.accountId == a.id);
    },
  },

  async created() {
    try {
      await this.$store.dispatch("getPasswordManagerEncryptionKey");
      await this.$store.dispatch("getPasswordManagerAccounts");
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 10px !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.clickable {
  cursor: pointer;
}
</style>
