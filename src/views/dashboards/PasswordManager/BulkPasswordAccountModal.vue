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
            p.m-2
              small
                | Upload a spreadsheet of accounts or manually add below.
                | #[strong You get a 50% discount by bulk uploading instead of adding 1-by-1].
            a.clickable(@click="generateTemplate") Click here to download template.
          form(@submit.prevent="sendAccountsToBlockchain")
            div
              div.text-center
                input.form-control.input-block.mr-2(
                  :id="`bulk-upload-file-input`"
                  type="file",
                  accept="text/csv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx",
                  @change="parseFile")
                button.btn.btn-primary(
                  v-loading="globalLoading"
                  :disabled="globalLoading"
                  @click.prevent="triggerFile")
                    | #[i.now-ui-icons.arrows-1_share-66] Upload Spreadsheet (.csv or .xlsx)

              div.mt-2.table-responsive
                table.table.table-striped.table-bordered.m-0
                  thead
                    tr
                      th Account Name
                      th Username
                      th Password
                      th Additional Info
                      th
                  tbody
                    tr(v-if="!uploadAccounts || uploadAccounts.length === 0")
                      td(colspan="100%")
                        i No accounts added yet...
                    tr(v-for="(account, ind) in uploadAccounts")
                      td {{ account.name }}
                      td {{ account.username }}
                      td {{ account.password }}
                      td {{ account.info }}
                      td.text-center
                        button.btn.btn-sm.btn-danger(
                          v-loading="globalLoading"
                          :disabled="globalLoading"
                          @click.prevent="removeAccount(ind)")
                            | #[i.fa.fa-times-circle]
                    tr  
                      td
                        fg-input(
                          group-classes="mb-0"
                          type="text"
                          placeholder="Enter account name"
                          v-model="newAccount.name")
                      td
                        fg-input(
                          group-classes="mb-0"
                          type="text"
                          placeholder="Enter username"
                          v-model="newAccount.username")
                      td
                        fg-input(
                          group-classes="mb-0"
                          type="password"
                          placeholder="Enter password"
                          v-model="newAccount.password")
                      td
                        fg-input(
                          group-classes="mb-0"
                          type="text"
                          placeholder="Enter additional info"
                          v-model="newAccount.info")
                      td.text-center
                        button.btn.btn-sm.btn-success(
                          v-loading="globalLoading"
                          :disabled="globalLoading"
                          @click.prevent="addAccount(ind)")
                            | #[i.fa.fa-plus-circle]

              p.mt-2.text-center If all information looks correct above, click submit to store accounts on the blockchain!

              div.d-flex.mt-2
                div.ml-auto
                  div.d-flex.justify-content-end
                    button.btn.btn-primary.ml-auto(
                      v-if="!needsToWriteDownPrivateKey"
                      type="submit"
                      v-loading="globalLoading"
                      :disabled="globalLoading || !minAccounts") Submit
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
              div.text-center.text-danger
                small(v-if="!minAccounts") Please add at least 5 accounts to bulk upload.
                small(v-else)
                  div
                    | You will spend #[strong {{ bulkCost || `CAN'T CALCULATE` }} {{ nativeCurrencySymbol }}]
                    | to store these accounts on the blockchain. 
                  div 
                    | It will not cost anything to
                    | read or update them in the future.
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
import FileUtils from "../../../factories/FileUtils";

export default {
  name: "BulkPasswordAccountModal",

  data() {
    return {
      needsToWriteDownPrivateKey: false,
      uploadAccounts: [],
      newAccount: {},
    };
  },

  computed: {
    ...mapState({
      cost: (state) => state.passwordManager.cost,
      encryptionKey: (state) => state.passwordManager.encryptionKey,
      globalLoading: (state) => state.globalLoading,
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
    }),

    bulkCost() {
      return (this.cost * (this.uploadAccounts || []).length) / 2;
    },

    minAccounts() {
      return this.uploadAccounts && this.uploadAccounts.length > 4;
    },
  },

  methods: {
    triggerFile() {
      document.getElementById(`bulk-upload-file-input`).click();
    },

    addAccount(account = this.newAccount) {
      this.uploadAccounts.push(account);
      this.newAccount = {};
    },

    removeAccount(index) {
      this.uploadAccounts.splice(index, 1);
    },

    generateTemplate() {
      const rows = [
        ["account name", "username", "password", "info"],
        [
          "Example Account",
          "example@gmail.com",
          "pAsSwOrD",
          "This is an example account for bulk upload.",
        ],
      ];

      let csvContent = `data:text/csv;charset=utf-8,${rows
        .map((e) => e.join(","))
        .join("\n")}`;

      const encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
    },

    async parseFile(evt) {
      try {
        const file = evt.target.files[0];
        let importedAccounts = await FileUtils.parseSpreadsheet(file);
        if (
          importedAccounts[0] &&
          importedAccounts[0][0] &&
          (importedAccounts[0][0].toLowerCase() == "name" ||
            importedAccounts[0][0].toLowerCase() == "account name" ||
            importedAccounts[0][0].toLowerCase() == "account_name")
        ) {
          // If first row looks like header, re-parse with `hasHeaders = true`
          importedAccounts = importedAccounts.slice(1);
        }
        importedAccounts = importedAccounts.map((a) => {
          return {
            name: a[0],
            username: a[1],
            password: a[2],
            info: a[3],
          };
        });
        this.uploadAccounts = this.uploadAccounts.concat(importedAccounts);
        this.$toast.success(`Successfully parsed file.`);
      } catch (err) {
        this.$toast.error(`Failed to parse file - ${err}.`);
      }
    },

    async sendAccountsToBlockchain() {
      try {
        if (!this.uploadAccounts || this.uploadAccounts.length < 5) {
          return this.$toast.error(
            "Please add at least 5 accounts before trying to upload to blockchain."
          );
        }

        this.$store.commit("SET_GLOBAL_LOADING", true);
        const hasKeyAlready = !!this.encryptionKey;
        const { key } = await this.$store.dispatch(
          "bulkUploadPasswordManagerAccountsTxn",
          this.uploadAccounts
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
        $(`#${this.$el.id}`).modal("hide");
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
</script>

<style scoped lang="scss">
input[type="file"] {
  // visibility: hidden;
  display: none;
}
</style>
