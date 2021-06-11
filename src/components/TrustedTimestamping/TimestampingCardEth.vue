<template lang="pug">
div
  div.row.flex-center.mb-2
    div.col.col-fill
      div.form-group.d-flex.justify-content-center.mb-2
        img.img-fluid(
          style="max-width: 20%"
          :src="activeNetworkLogo")
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

        button.btn.btn-primary(
          v-loading="globalLoading", 
          :disabled="globalLoading || !activeNetwork"
          @click="sendTrustedTimestampTxn")
            div Submit File Signature to Blockchain

      div.text-center(v-else)
        div.mb-1 Select the file you want to store its signature on the blockchain:
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
      activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
      globalLoading: (state) => state.globalLoading,
      activeNetwork: (_, getters) => getters.activeNetwork,
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
        this.$store.commit("SET_GLOBAL_LOADING", true);

        await this.$store.dispatch("sendTrustedTimestampTxn", {
          hash: this.fileHashString,
          fileName: this.file.name,
          fileSize: this.file.size,
        });

        await this.$store.dispatch("getTimestampingHashes");
        this.resetFile();
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
