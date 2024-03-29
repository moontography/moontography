<template lang="pug">
div
  div.row.flex-center.mb-2
    div.col.col-fill
      div.form-group.mb-2
        img.img-fluid.mx-auto(
          style="max-width: 100px"
          :src="activeNetworkLogo")
        
      div.text-center(v-if="file.hash")
        div
          div.d-flex.justify-content-center.align-items-center
            strong {{ file.name }}
            button.button.btn-sm.close.ml-1(@click="resetFile")
              i.now-ui-icons.ui-1_simple-remove
          div.d-flex.justify-content-center
            div.alert.alert-info.mb-1.overflow-auto
              div.text-center
                div {{ fileHashString }}
                div.mt-4(v-if="hashedFileAlreadyUploadedInfo")
                  small 
                    | We recognize this file signature that you added back on #[strong {{ hashedFileAlreadyUploadedInfo.time }}]!
                    | The file name was #[strong {{ hashedFileAlreadyUploadedInfo.fileName }}] and file size is
                    | #[strong {{ hashedFileAlreadyUploadedInfo.fileSizeBytes }}] bytes.

        button.mt-4.btn.btn-primary(
          v-loading="globalLoading", 
          :disabled="globalLoading || !activeNetwork"
          @click="sendTrustedTimestampTxn")
            div Submit File Signature to Blockchain
        div.text-danger
          small 
            | You will spend #[strong {{ timestampingCost || `CAN'T CALCULATE` }} {{ nativeCurrencySymbol }}]
            | to send this file signature to the blockchain.

      div.text-center(v-else)
        div.mb-1 Select the file you want to store its signature on the blockchain:
        input-file-hash(@change="hashFile")
</template>

<script>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
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
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      timestampingCost: (state) => state.trustedTimestamping.cost,
      timestampingHashes: (state) => state.trustedTimestamping.hashes || [],
      globalLoading: (state) => state.globalLoading,
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      nativeCurrencySymbol: (_, getters) => getters.nativeCurrencySymbol,
    }),

    fileHashString() {
      if (!this.file.hash) return null;
      return `0x${Xlm().getStellarHash(this.file.hash).value.toString("hex")}`;
    },

    hashedFileAlreadyUploadedInfo() {
      if (!this.timestampingHashes || this.timestampingHashes.length === 0)
        return;
      if (!(this.file && this.file.hash)) return;

      const existingHash = this.timestampingHashes.find(
        (h) => h.dataHash.toLowerCase() === `0x${this.file.hash}`.toLowerCase()
      );
      if (!existingHash) return;

      return {
        ...existingHash,
        time: `${dayjs(
          new BigNumber(existingHash.time).times(1e3).toNumber()
        ).format("YYYY-MM-DD HH:mm:ss")}`,
      };
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
        this.$store.commit("SET_GLOBAL_LOADING", true);

        await this.$store.dispatch("sendTrustedTimestampTxn", {
          hash: this.fileHashString,
          fileName: this.file.name,
          fileSize: this.file.size,
        });

        await this.$store.dispatch("getTimestampingHashes");
        this.$toast.success("Successfully stored signature on blockchain!");
      } catch (err) {
        console.error(err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
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
