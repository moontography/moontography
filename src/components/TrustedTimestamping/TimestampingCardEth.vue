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
              td
                div.d-flex.justify-content-center.align-items-center
                  strong {{ file.name }}
                  button.button.btn-sm.close.ml-1(@click="resetFile")
                    i.now-ui-icons.ui-1_simple-remove
            tr
              td
                div.d-flex.justify-content-center
                  div.alert.alert-info.mb-1
                    small {{ fileHashString }}

        loading-global
          button.btn.btn-success(
            :disabled="!activeNetwork"
            @click="sendTrustedTimestampTxn")
              div Store File Hash on Blockchain

      div.text-center(v-else)
        div.mb-1 Select the file you want to hash on the blockchain:
        input-file-hash(@change="hashFile")
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
        // Start loading
        this.$store.dispatch("setGlobalLoading", true);

        await this.$store.dispatch("ethCheckApprovalStatusForTokenContract");
        if (!this.isApproved) {
          await this.$store.dispatch("ethApproveTokenContract");
        }

        await this.$store.dispatch("sendTrustedTimestampTxn", {
          hash: this.fileHashString,
          fileName: this.file.name,
          fileSize: this.file.size,
        });

        // TODO: reload hashes

        // Stop loading
        this.$store.dispatch("setGlobalLoading", false);

        this.$toast.success("Successfully sent to blockchain!");
      } catch (err) {
        this.$store.dispatch("setGlobalLoading", false);
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
