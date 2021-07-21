<template lang="pug">
.row
  .col-md-12(v-if="localError")
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
  .col-md-8.mx-auto(v-else)
    .row.mb-2
      .col-lg-12
        card
          template(v-slot:header='')
            div
              h4.card-title.mb-0
                | Token Contract Address You're Airdropping
              //- div.text-secondary
              //-   small The token users can stake to earn rewards from the rewards pool you've provided.
          token-input-standalone(
            v-model="tokenInfo"
            btn-text="Set Token to Airdrop")

    .row.mb-2
      .col-md-12.mx-auto
        card
          template(v-slot:header='')
            h4.card-title
              | Addresses to Send Tokens
          div
            div.text-center
              div
                a.clickable(@click="generateTemplate") Click here to download template.
              input.form-control.input-block.mr-2(
                :id="`bulk-upload-airdropper-addresses`"
                type="file",
                accept="text/csv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx",
                @change="parseFile")
              button.btn.btn-primary(
                v-loading="globalLoading"
                :disabled="globalLoading"
                @click.prevent="triggerFile")
                  | #[i.now-ui-icons.arrows-1_share-66] Upload Spreadsheet (.csv or .xlsx)

            div.mt-2
              table.table.table-striped.table-bordered.m-0
                thead
                  tr
                    th Address
                    th Amount {{ tokenInfo && tokenInfo.symbol ? tokenInfo.symbol : 'Tokens' }} to send
                    th
                tbody
                  tr(v-if="!addresses || addresses.length === 0")
                    td(colspan="100%")
                      i No addresses added yet...
                  tr(v-for="(addy, ind) in addresses")
                    td
                      div {{ addy.address }}
                      div.text-danger.mt-2(v-if="!isValidAddress(addy.address)")
                        i Not a valid address, please make sure you entered it correctly!
                    td {{ addy.tokens }}
                    td.text-center
                      button.btn.btn-sm.btn-danger(
                        v-loading="globalLoading"
                        :disabled="globalLoading"
                        @click.prevent="removeAddress(ind)")
                          | #[i.fa.fa-times-circle]
                  tr  
                    td
                      fg-input(
                        group-classes="mb-0"
                        type="text"
                        placeholder="Enter wallet address"
                        v-model="newAddress.address")
                    td
                      fg-input(
                        group-classes="mb-0"
                        type="number"
                        placeholder="Enter number of tokens to send"
                        v-model="newAddress.tokens")
                    td.text-center
                      button.btn.btn-sm.btn-success(
                        v-loading="globalLoading"
                        :disabled="globalLoading"
                        @click.prevent="addAddress(ind)")
                          | #[i.fa.fa-plus-circle]
    
    .row
      .col-md-12.mx-auto
        div.alert.alert-warning(v-if="!isFormValidated")
          b Please enter all information above in order to airdrop tokens to your users.
        div.alert.alert-primary(v-else)
          h3.m-0 Send Tokens!
          div.mt-4
            ol
              li.mb-2
                | You will be airdropping #[b {{ totalAmountToSend }} {{ tokenInfo.symbol }}]
                | to a total of  #[b {{ addresses.length }}] wallet addresses.
          div.mt-2
            div.text-center
              n-button(
                type="success"
                size="lg"
                v-loading="globalLoading"
                :disabled="globalLoading"
                @click="airdropTokens") Airdrop Your {{ tokenInfo.symbol }} Now!
          div.row.mt-2
            div.col-lg-8.mx-auto.text-center
              div You will spend #[b {{ airdropCost }} MTGY] to use the Airdropper service.
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import FileUtils from "../../../factories/FileUtils";

export default {
  data() {
    return {
      localError: null,
      tokenInfo: null,
      addresses: [],
      newAddress: {
        address: "",
        tokens: "",
      },
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      airdropCost: (state) => new BigNumber(state.airdropper.cost).toFormat(0),
      globalLoading: (state) => state.globalLoading,
      web3: (state) => state.web3.instance,
    }),

    airdropCont() {
      return this.activeNetwork.contracts.airdropper;
    },

    isFormValidated() {
      return (
        this.tokenInfo &&
        this.tokenInfo.address &&
        this.tokenInfo.decimals &&
        this.addresses &&
        this.addresses.length > 0 &&
        this.addresses.reduce(
          (isValid, row) => isValid && this.isValidAddress(row.address),
          true
        )
      );
    },

    totalAmountToSend() {
      const total = this.addresses.reduce(
        (total, info) => new BigNumber(total).plus(info.tokens || 0),
        new BigNumber(0)
      );
      return total.toFormat(6);
    },
  },

  methods: {
    addAddress(account = this.newAddress) {
      this.addresses.push(account);
      this.newAddress = { address: "", tokens: "" };
    },

    removeAddress(index) {
      this.addresses.splice(index, 1);
    },

    triggerFile() {
      document.getElementById(`bulk-upload-airdropper-addresses`).click();
    },

    isValidAddress(addy) {
      return this.web3.utils.isAddress(addy);
    },

    generateTemplate() {
      const rows = [
        ["0x3A3ffF4dcFCB7a36dADc40521e575380485FA5B8", "1000"],
        ["0x87644cB97C1e2Cc676f278C88D0c4d56aC17e838", "550"],
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
        let newAddresses = await FileUtils.parseSpreadsheet(file);
        newAddresses = newAddresses.map((a) => {
          return {
            address: a[0],
            tokens: a[1],
          };
        });
        this.addresses = this.addresses.concat(newAddresses);
        this.$toast.success(`Successfully parsed file.`);
      } catch (err) {
        this.$toast.error(`Failed to parse file - ${err}.`);
      }
    },

    async airdropTokens() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        if (!this.isFormValidated)
          return this.$toast.error(
            `Please ensure all information has been completed and is valid before proceeding.`
          );
        await this.$store.dispatch("airdropTokens", {
          tokenAddress: this.tokenInfo.address,
          addresses: this.addresses,
        });
        this.$toast.success(`Successfully airdropped your tokens!`);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async created() {
    if (!this.airdropCont) {
      return (this.localError = new Error(
        `The connected network does not support the Airdropper dApp yet.`
      ));
    }

    await this.$store.dispatch("getAirdropperCost");
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  // visibility: hidden;
  display: none;
}
</style>
