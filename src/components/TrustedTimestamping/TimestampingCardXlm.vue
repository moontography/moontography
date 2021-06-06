<template lang="pug">
div
  div.row.flex-center(v-if="error")
    div.col-12
      div.alert.alert-danger {{ error.stack }}
  div.row.flex-center(v-else-if="success")
    div.col-12
      div.alert.alert-success
        | Successfully sent file hash to blockchain!
        | #[a(target="_blank" :href="`https://stellar.expert/explorer/public/tx/${txn.id}`") Click here]
        | to review transaction: {{ txn.id }}
  div.row.flex-center.mb-2
    div.col.col-fill
      div.form-group.d-flex.justify-content-center.mb-2
        img.img-fluid(
          style="max-width: 25%"
          src="img/stellar.png")
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
        div.mb-1 Select the file you want to store its signature on the blockchain:
        input-file-hash(@change="hashFile")
  div.row.flex-center
    div.col.col-fill
      secret-seed
  div.row.flex-center
    div.col
      div.alert.alert-primary(v-if="isLoading")
        | Creating transaction now, sit tight for a couple seconds...
      button.btn(
        v-else
        :class="!(xlmSecretSeed && file.hash) ? 'btn-secondary' : 'btn-success'"
        :disabled="!(xlmSecretSeed && file.hash)"
        @click="sendTrustedTimestampTxn")
          div Send File Hash to Stellar Blockchain
          div
            small
              small
                | This will send ${{ usdToSend }} USD (~{{ getXlmThatWillBeSent }} XLM)
                | from your account to ours to keep the lights on. Your file hash
                | will be stored in that transaction in the memo.
</template>

<script>
import { mapState } from "vuex";
import Xlm, { getXlmPerUsdAmount } from "../../factories/Xlm";

export default {
  name: "TTTimestampingCardXlm",

  data() {
    return {
      error: "",
      success: false,
      file: getEmptyFile(),
      txn: null,
      getXlmThatWillBeSent: null,
      isLoading: false,
    };
  },

  computed: {
    ...mapState({
      xlmPublicKey: (state) => state.trustedTimestamping.xlm.xlmPublicKey,
      xlmSecretSeed: (state) => state.trustedTimestamping.xlm.xlmSecretSeed,
      usdToSend: (state) => state.trustedTimestamping.xlm.usdToSend,
    }),

    fileHashString() {
      if (!this.file.hash) return null;
      return Xlm().getStellarHash(this.file.hash).value.toString("hex");
    },
  },

  methods: {
    resetFile() {
      this.error = "";
      this.file = getEmptyFile();
    },

    hashFile(fileInfo) {
      this.file = fileInfo;
    },

    async sendTrustedTimestampTxn() {
      try {
        this.isLoading = true;
        this.success = false;
        if (!this.xlmSecretSeed)
          throw new Error(
            `You need to enter your XLM private key/secret in order to send a transaction.`
          );

        if (!this.file.hash)
          throw new Error(
            `Make sure you upload a file to send it's SHA256 hash to the blockchain.`
          );

        const transactor = Xlm(this.xlmSecretSeed);
        const txn = await transactor.txn(this.file.hash, this.xlmPublicKey);
        this.txn = txn;
        this.error = "";
        this.success = true;
      } catch (err) {
        console.error(err);
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
  },

  async created() {
    this.getXlmThatWillBeSent = await getXlmPerUsdAmount(this.usdToSend);
  },
};

function getEmptyFile() {
  return {
    name: "",
    hash: "",
  };
}
</script>
