<template lang="pug">
div
  div.row.flex-center.mb-2
    div.col.col-fill
      div.form-group.d-flex.justify-content-center.mb-2
        img.img-fluid(
          style="max-width: 25%"
          src="img/bsc.png")
      div.text-center(v-if="file.hash")
        table.no-border.mx-auto
          tbody
            tr
              td.mb-2
                strong {{ file.name }}
            tr
              td
                div.d-flex.justify-content-center
                  div.alert.alert-success.mb-1
                    small {{ fileHashString }}
        button.btn.btn-primary.btn-sm(@click="resetFile") Upload Another File
      div.text-center(v-else)
        div.mb-1 Select the file you want to hash on the blockchain:
        input-file-hash(@change="hashFile")
  div.row.flex-center
    div.col.d-flex.justify-content-center
      div.alert.alert-primary(v-if="isLoading")
        | Creating transaction now, sit tight for a couple seconds...
      button.btn.btn-success(
        v-else-if="file.hash"
        :disabled="!activeNetwork"
        @click="sendTrustedTimestampTxn")
          div Store File Hash on Blockchain
</template>

<script>
import { mapState } from "vuex";
import InputFileHash from "./InputFileHash";
import Xlm from "../../factories/Xlm";

export default {
  name: "TTTimestampingCardEth",

  components: {
    InputFileHash,
  },

  data() {
    return {
      success: false,
      file: getEmptyFile(),
      txn: null,
      getXlmThatWillBeSent: null,
      isLoading: false,
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork,
      isApproved: (state) => state.web3.isApproved,
    }),

    fileHashString() {
      if (!this.file.hash) return null;
      return `0x${Xlm().getStellarHash(this.file.hash).value.toString("hex")}`;
    },
  },

  methods: {
    resetFile() {
      this.file = getEmptyFile();
    },

    hashFile(fileInfo) {
      this.file = fileInfo;
    },

    async sendTrustedTimestampTxn() {
      try {
        await this.$store.dispatch("ethCheckApprovalStatusForTokenContract");
        if (!this.isApproved) {
          await this.$store.dispatch("ethApproveTokenContract");
        }

        // TODO; start loading
        await this.$store.dispatch("sendTrustedTimestampTxn", {
          hash: this.fileHashString,
          fileName: this.file.name,
          fileSize: this.file.size,
        });
        // TODO; reload hashes
        // TODO; stop loading
      } catch (err) {
        false;
      }
    },
  },
};

function getEmptyFile() {
  return {
    name: "",
    hash: "",
    size: 0,
  };
}
</script>
