<template lang="pug">
card.p-2(v-loading="globalLoading")
  .card-body
    div.d-flex.align-items-center
      h3.m-0.d-flex.align-items-center #[i.now-ui-icons.business_badge.mr-2] {{ account.name }}
      div.ml-auto.d-flex.align-items-center
        button.btn.btn-secondary.mr-3(
          data-toggle="modal"
          data-target="#password-account-modal-update") #[i.fa.fa-plus-circle.mr-2] Update {{ account.name }}
        router-link(to="/passwords")
          button.close.text-secondary(type='button')
            span(aria-hidden='true') &minus;
    hr.mb-4
    
    div.d-flex.align-items-center #[i.now-ui-icons.business_badge.mr-1] Username:
    b {{ account.email }}
    
    div.mt-4.d-flex.align-items-center #[i.fa.fa-lock.mr-1] Password: 
    b.clickable(@click="toggleShowPassword()")
      | {{ showPassword ? `${account.password} (hide)` : '(show)' }}

    template(v-if="account.info")
      div.d-flex.align-items-center.mt-4 #[i.now-ui-icons.travel_info.mr-1] Additional Info: 
      b {{ account.info }}

    div.mt-4.d-flex.align-items-center #[i.fa.fa-remove.mr-1] Delete: 
    b.clickable(@click="deleteAccount()")
      i.text-danger Delete Account

password-account-modal#password-account-modal-update(:account="account")
</template>

<script>
import Swal from "sweetalert2";
import { mapState } from "vuex";
import PasswordAccountModal from "./PasswordAccountModal";

export default {
  components: {
    PasswordAccountModal,
  },

  props: {
    account: { type: Object, required: true },
  },

  computed: mapState({
    globalLoading: (state) => state.globalLoading,
  }),

  data() {
    return {
      showPassword: false,

      deleteAccountAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),
    };
  },

  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    async deleteAccount() {
      try {
        const { isConfirmed } = await this.deleteAccountAlert.fire({
          title: "Are you sure?",
          html: `
          <div>Are you sure you want to delete <strong>${this.account.name}</strong>?</div>
        `,
          confirmButtonText: "Yes, I want to delete this account!",
          cancelButtonText: "Cancel",
          showCancelButton: true,
        });

        if (!isConfirmed) return;
        this.$store.commit("SET_GLOBAL_LOADING", true);
        const wasDeleted = await this.$store.dispatch(
          "deletePasswordManagerAccount",
          this.account.id
        );
        if (!wasDeleted) {
          this.$toast.error(`Your account was not deleted for some reason.`);
        } else {
          this.$toast.success(
            `Your account was successfully deleted! It will not longer show up in the list moving forward.`
          );
        }
        await this.$store.dispatch("getPasswordManagerAccounts");
      } catch (err) {
        console.error("Error deleting account", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },
};
</script>
