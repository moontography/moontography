<template lang="pug">
div.d-flex.justify-content-center
  input.input-block(
    :id="`hash-file-${uid}`"
    type="file"
    @change="hashFile")
  button.btn.btn-primary(
    v-loading="globalLoading"
    :disabled="globalLoading"
    @click="triggerFile")
      | #[i.now-ui-icons.arrows-1_share-66] Add File to Calculate its Signature
</template>

<script>
import { mapState } from "vuex";
import { v1 } from "uuid";
import FileUtils from "../../factories/FileUtils";

export default {
  name: "TTInputFileHash",

  data() {
    return {
      uid: null,
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),
  },

  methods: {
    triggerFile() {
      document.getElementById(`hash-file-${this.uid}`).click();
    },

    async hashFile(evt) {
      try {
        const file = evt.target.files[0];
        const fileHash = await FileUtils.sha256(file);
        this.$emit("change", {
          name: file.name,
          size: file.size,
          hash: fileHash,
        });
        this.$toast.success(
          `Successfully generated the SHA 256 hash/data signature of the file: 0x${fileHash}`
        );
      } catch (err) {
        this.$toast.error(`Failed to hash file - ${err}`);
      }
    },
  },

  beforeCreate() {
    this.uid = v1();
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  // visibility: hidden;
  display: none;
}
</style>
