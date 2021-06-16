<template lang="pug">
div
  div(v-if="!encryptionKey")
    button.btn.btn-lg.btn-success(@click="createKeyAndShow") #[i.fa.fa-plus-circle.mr-2] Create New Encryption Key
    p or
    div.d-flex.align-items-center
      input.form-control(
        placeholder="Enter an exisiting encryption key..."
        v-model="existingKey")
      div.ml-2
        button.btn.btn-sm.btn-info.m-0(@click="setExistingKey(existingKey)") #[i.fa.fa-check]
  template(v-else)
    div.mb-1
      small Click lock to show/hide your encryption key. Write this down in case you need it later!
    a.clickable(@click="showEncryptionKey = !showEncryptionKey")
      i.now-ui-icons.ui-1_lock-circle-open
    div.mt-2(v-if="showEncryptionKey")
      div
        small Encryption Key:
      b {{ base64EncryptionKey }}
</template>

<script>
import { mapState } from "vuex";
import Cryptography from "browser-cryptography";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      showEncryptionKey: false,
      base64EncryptionKey: null,
      existingKey: null,

      keyAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      }),
    };
  },

  computed: mapState({
    encryptionKey: (state) => state.passwordManager.encryptionKey,
  }),

  watch: {
    async encryptionKey() {
      await this.buildBase64Key();
    },
  },

  methods: {
    async setExistingKey(existingKey = this.existingKey) {
      if (existingKey) {
        localStorage.mtgyPasswordManagerEncryptionKey = existingKey;
        await this.$store.dispatch("getPasswordManagerEncryptionKey");
        await this.$store.dispatch("getPasswordManagerAccounts");
      }
    },

    async createKeyAndShow() {
      const crypt = Cryptography();
      const newKey = await crypt.generateCryptoKey();
      const newKeyBase64 = await crypt.cryptoKeyToBase64(newKey);
      localStorage.mtgyPasswordManagerEncryptionKey = newKeyBase64;
      await this.$store.dispatch("getPasswordManagerEncryptionKey");

      /* const result = */ await this.keyAlert.fire({
        title: "Please write this down!",
        html: `
          <div>The following is required to recover and show your
          accounts that are stored on the blockchain. Write this down
          somewhere safe in case you need to enter it again:</div>
          <div class="mt-3"><b><small>${newKeyBase64}</small></b></div>
        `,
        confirmButtonText: "Okay, I wrote it down!",
        // cancelButtonText: "Cancel",
        // showCancelButton: true,
      });
    },

    async buildBase64Key() {
      this.base64EncryptionKey = await Cryptography().cryptoKeyToBase64(
        this.encryptionKey
      );
    },
  },

  async created() {
    if (this.encryptionKey) await this.buildBase64Key();
  },
};
</script>
