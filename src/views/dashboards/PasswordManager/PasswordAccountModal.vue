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
          h3.modal-title.d-flex.align-items-center #[i.now-ui-icons.users_circle-08.mr-2] Account
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
                v-model="mutableAccount.username")

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
    accountId: { type: String, default: null },
    iv: { type: String, default: null },
    name: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
    info: { type: String, default: null },
  },

  watch: {
    accountId() {
      this.mutableAccount = this.populateAccount();
      console.log("GOTHERE2", this.mutableAccount);
    },

    name() {
      this.mutableAccount = this.populateAccount();
    },

    username() {
      this.mutableAccount = this.populateAccount();
    },
  },

  data() {
    return {
      needsToWriteDownPrivateKey: false,
      mutableAccount: this.populateAccount(),
    };
  },

  computed: mapState({
    cost: (state) => state.passwordManager.cost,
    encryptionKey: (state) => state.passwordManager.encryptionKey,
    globalLoading: (state) => state.globalLoading,
  }),

  methods: {
    populateAccount() {
      return {
        id: this.accountId,
        iv: this.iv,
        name: this.name,
        username: this.username,
        password: this.password,
        info: this.info,
      };
    },

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
        this.$toast.success(
          `Successfully sent account info to blockchain and refreshed list!`
        );
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
    this.mutableAccount = this.populateAccount();
    console.log("GOTHERE1", this.mutableAccount);
  },
};
</script>
