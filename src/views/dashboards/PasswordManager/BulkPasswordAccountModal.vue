<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='bulk-password-account-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header
          h3.modal-title.d-flex.align-items-center #[i.now-ui-icons.users_circle-08.mr-2] Bulk Upload
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.text-center
            p Upload a .csv of at least five accounts to add to Password Manager. #[b Format should follow table below:]
          form(@submit.prevent="sendAccountsToBlockchain")
            div
              div.text-center
                input.form-control.input-block.mr-2(
                  :id="`bulk-upload-file-${uid}`"
                  type="file",
                  @change="parseFile")
                button.btn.btn-primary(
                  v-loading="globalLoading"
                  :disabled="globalLoading"
                  @click.prevent="triggerFile")
                    | #[i.now-ui-icons.arrows-1_share-66] Upload CSV

              div.mt-2.table-responsive
                table.table.table-striped.table-bordered.m-0
                  thead
                    tr
                      th Account Name
                      th Username
                      th Password
                      th Additional Info
                  tbody
                    tr(v-if="!uploadedAccounts || uploadedAccounts.length === 0")
                      td(colspan="100%")
                        i No accounts uploaded yet...
                    tr(v-for="account in uploadedAccounts")
                      td {{ account.name }}
                      td {{ account.username }}
                      td {{ account.password }}
                      td {{ account.info }}
                
              p.mt-2.text-center If all information looks correct above, click submit to store accounts on the blockchain!

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
                  div.text-danger(v-if="!accountId")
                    small
                      div
                        | You will spend #[strong {{ cost || `CAN'T CALCULATE` }} MTGY]
                        | to store this account on the blockchain. 
                      div 
                        | It will not cost anything to
                        | read or update it in the future.
</template>

<script>
import { mapState } from "vuex";
import FileUtils from "../../../factories/FileUtils";

export default {
  name: "BulkPasswordAccountModal",

  data() {
    return {
      needsToWriteDownPrivateKey: false,
      uploadedAccounts: [],
    };
  },

  computed: mapState({
    cost: (state) => state.passwordManager.cost,
    encryptionKey: (state) => state.passwordManager.encryptionKey,
    globalLoading: (state) => state.globalLoading,
  }),

  methods: {
    triggerFile() {
      document.getElementById(`bulk-upload-file-${this.uid}`).click();
    },

    async parseFile(evt) {
      try {
        const file = evt.target.files[0];
        this.uploadedAccounts = await FileUtils.parseCsvFile(file);

        if (
          this.uploadedAccounts[0] &&
          this.uploadedAccounts[0][0] &&
          (this.uploadedAccounts[0][0].toLowerCase() == "name" ||
            this.uploadedAccounts[0][0].toLowerCase() == "account name")
        ) {
          // If first row looks like header, re-parse with `hasHeaders = true`
          this.uploadedAccounts = await FileUtils.parseCsvFile(file, true);
        } else {
          // Else map rows with expected account keys
          this.uploadedAccounts = this.uploadedAccounts.map((a) => {
            return {
              name: a[0],
              username: a[1],
              password: a[2],
              info: a[3],
            };
          });
        }

        this.$toast.success(`Successfully parsed file.`);
      } catch (err) {
        this.$toast.error(`Failed to parse file - ${err}.`);
      }
    },

    async sendAccountsToBlockchain() {
      console.log(this.uploadedAccounts);
      if (!this.uploadedAccounts || this.uploadedAccounts.length === 0)
        return this.$toast.error(
          "Please upload accounts before trying to upload to blockchain."
        );

      // try {
      //   this.$store.commit("SET_GLOBAL_LOADING", true);
      //   const hasKeyAlready = !!this.encryptionKey;
      //   const { key } = await this.$store.dispatch(
      //     "sendPasswordManagerAccountTxn",
      //     this.mutableAccount
      //   );
      //   if (!hasKeyAlready) {
      //     this.needsToWriteDownPrivateKey = true;
      //     localStorage.mtgyPasswordManagerEncryptionKey = key;
      //     this.$store.commit("SET_PASSWORD_MANAGER_ENCRYPTION_KEY", key);
      //   }
      //   await this.$store.dispatch("getPasswordManagerAccounts");
      //   this.$toast.success(
      //     `Successfully sent account info to blockchain and refreshed list!`
      //   );
      //   $(`#${this.$el.id}`).modal("hide");
      // } catch (err) {
      //   console.error("Error sending account to blockchain", err);
      //   this.$toast.error(err.message);
      // } finally {
      //   this.$store.commit("SET_GLOBAL_LOADING", false);
      // }
    },
  },

  async created() {
    await this.$store.dispatch("getPasswordManagerCost");
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  // visibility: hidden;
  display: none;
}
</style>
