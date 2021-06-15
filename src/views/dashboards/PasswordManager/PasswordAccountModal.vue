<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='password-account-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header
          h3.modal-title.d-flex.align-items-center #[i.now-ui-icons.users_circle-08.mr-2] Account #[i.text-danger(v-if="this.mutableAccount.id") *]
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          form(@submit.prevent="sendAccountToBlockchain")
            div
              fg-input.mb-4(
                label="Name"
                type="text"
                placeholder="Enter account name"
                v-model="mutableAccount.name")

              //- fg-input.mb-4(
              //-   label="Email Address"
              //-   type="email"
              //-   placeholder="Enter email"
              //-   v-model="mutableAccount.email")
              fg-input.mb-4(
                label="Username"
                type="text"
                placeholder="Enter username"
                v-model="mutableAccount.email")

              fg-input.mb-4(
                label="Password"
                type="password"
                placeholder="Enter password"
                v-model="mutableAccount.password")

              fg-input.mb-2(
                label="Additional Info"
                type="text"
                placeholder="Enter additional information"
                v-model="mutableAccount.info")

              div.d-flex(v-if="this.mutableAccount.id")
                small.mx-auto
                  i #[span.text-danger *]When editing an exisiting account, a new account will be created with the updated account information.
              div.d-flex.mt-2
                div.ml-auto
                  div.d-flex.justify-content-end
                    button.btn.btn-primary.ml-auto(
                      v-if="!needsToWriteDownPrivateKey"
                      type="submit"
                      v-loading="globalLoading"
                      :disabled="globalLoading") Submit
                    template(v-else)
                      div
                        div
                          | We didn't find an encryption key to encrypt your account info with before
                          | sending it to the blockchain. Therefore, we created one
                        .my-3
                          strong {{ encryptionKey }}
                      button.btn.btn-lg.btn-danger.mx-auto(
                        type="submit"
                        v-loading="globalLoading"
                        :disabled="globalLoading")
                          | I wrote down my key and want to store this password on the blockchain!
                  div.text-danger
                    small
                      div
                        | You will spend #[strong {{ cost || `CAN'T CALCULATE` }} MTGY]
                        | to store this account on the blockchain. 
                      div 
                        | It will not cost anything to
                        | read or update them in the future.
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PasswordAccountModal",

  props: {
    account: { type: Object, default: null },
  },

  watch: {
    account: {
      handler(newAccount) {
        this.mutableAccount = {
          ...defaultAccount(),
          ...newAccount,
          ...this.account,
        };
      },
      deep: true,
    },
  },

  data() {
    return {
      needsToWriteDownPrivateKey: false,
      mutableAccount: { ...defaultAccount(), ...this.account },
    };
  },

  computed: mapState({
    cost: (state) => state.passwordManager.cost,
    encryptionKey: (state) => state.passwordManager.encryptionKey,
    globalLoading: (state) => state.globalLoading,
  }),

  methods: {
    async sendAccountToBlockchain() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        const hasKeyAlready = !!this.encryptionKey;
        const { key } = await this.$store.dispatch(
          "sendPasswordManagerAccountTxn",
          this.mutableAccount
        );
        if (!hasKeyAlready) {
          this.needsToWriteDownPrivateKey = true;
          localStorage.mtgyPasswordManagerEncryptionKey = key;
          this.$store.commit("SET_PASSWORD_MANAGER_ENCRYPTION_KEY", key);
        }
        await this.$store.dispatch("getPasswordManagerAccounts");
      } catch (err) {
        console.error("Error sending account to blockchain", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async created() {
    await this.$store.dispatch("getPasswordManagerCost");
  },
};

function defaultAccount() {
  return {
    name: null,
    email: null,
    password: null,
    info: null,
  };
}
</script>
