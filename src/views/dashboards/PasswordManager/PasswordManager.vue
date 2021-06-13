<template lang="pug">
.row
  .col-md-6.mx-auto
    card.p-2
      div.d-flex.align-items-center.mb-2
        h3.m-0 #[i.fa.fa-address-book.text-primary.mr-2] Your Accounts
        div.ml-auto
          button.btn.btn-primary(data-toggle="modal", data-target="#password-account-modal") #[i.fa.fa-plus-circle.mr-2] Add Account
      input.form-control(
        placeholder="Search accounts.."
        v-model="accountSearch")

      .card-body
        .text-center(v-if="isLoading")
          loading-panel

        div.mt-2(v-else-if="filteredAccounts && filteredAccounts.length > 0")
          router-link(v-for="account in filteredAccounts", :to="`/passwords/${account.id}`")
            card.clickable(:class="`${id == account.id ? 'active' : ''}`")
              p #[i.now-ui-icons.users_circle-08.mr-2] {{ account.name }}
              p #[i.now-ui-icons.business_badge.mr-2] {{ account.email }}
              p #[i.now-ui-icons.travel_info.mr-2] {{ account.info }}

        .text-center.mt-2(v-else)
          i No accounts found...

  .col-md-6(v-if="activeAccount")
    card.p-2
      .card-body
        .text-center(v-if="isLoading")
          loading-panel
        
        div(v-else)
          div.d-flex.align-items-center
            h3.m-0 #[i.now-ui-icons.users_circle-08.mr-2] {{ activeAccount.name }}
            router-link.ml-auto(to="/passwords")
              button.close.text-danger(type='button')
                span(aria-hidden='true') &times;
          hr.mb-4
          
          div #[i.now-ui-icons.business_badge.mr-1] Email:
          b {{ activeAccount.email }}
          
          div.mt-4 #[i.fa.fa-lock.mr-1] Password: 
          b.clickable(@click="toggleShowPassword(activeAccount.id)") {{ showPassword[activeAccount.id] ? `${activeAccount.password} (click to hide)` : '(click to show)' }}

          div.mt-4 #[i.now-ui-icons.travel_info.mr-1] Additional Info: 
          b {{ activeAccount.info }}

password-account-modal#password-account-modal
</template>
<script>
import { mapState } from "vuex";
import PasswordAccountModal from "./PasswordAccountModal.vue";

export default {
  components: {
    PasswordAccountModal,
  },

  data() {
    return {
      isLoading: true,
      accountSearch: "",
      showPassword: {},

      accounts: [
        {
          id: 1,
          name: "Facebook",
          email: "johndoe@gmail.com",
          password: "supersecret",
          info: "This is my facebook account",
        },
        {
          id: 2,
          name: "Instagram",
          email: "johndoe@gmail.com",
          password: "password",
          info: "This is my instagram account",
        },
      ],
    };
  },

  props: {
    id: { type: [Number, String], default: null },
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),

    filteredAccounts() {
      return this.accounts.filter((a) => {
        return (
          (a.name &&
            a.name.toLowerCase().includes(this.accountSearch.toLowerCase())) ||
          (a.email &&
            a.email.toLowerCase().includes(this.accountSearch.toLowerCase()))
        );
      });
    },

    activeAccount() {
      return this.accounts.find((a) => this.id == a.id) || false;
    },
  },

  methods: {
    toggleShowPassword(accountId) {
      this.showPassword[accountId] = !this.showPassword[accountId];
    },
  },

  async created() {
    try {
      console.log("init");
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
  margin-bottom: 0 !important;
  box-shadow: 0 1px 3px 1px rgba(39, 39, 39, 0.1) !important;

  .active {
    background-color: primary;
  }
}

.clickable {
  cursor: pointer;
}
</style>
