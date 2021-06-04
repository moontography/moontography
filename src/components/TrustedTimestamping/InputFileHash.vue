<template lang="pug">
div.d-flex.justify-content-center
  input.input-block(
    :id="`hash-file-${uid}`"
    type="file"
    @change="hashFile")
  loading-global
    button.btn.btn-primary(@click="triggerFile")
      | #[i.now-ui-icons.arrows-1_share-66] Upload File to Hash
</template>

<script>
import { v1 } from "uuid";
import FileUtils from "../../factories/FileUtils";

export default {
  name: "TTInputFileHash",

  data() {
    return {
      uid: null,
    };
  },

  methods: {
    triggerFile() {
      document.getElementById(`hash-file-${this.uid}`).click();
    },

    async hashFile(evt) {
      try {
        const file = evt.target.files[0];
        this.$emit("change", {
          name: file.name,
          size: file.size,
          hash: await FileUtils.sha256(file),
        });
      } catch (err) {
        this.$emit("error", err);
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
