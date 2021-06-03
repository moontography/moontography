<template lang="pug">
div.form-group
  label(:for="`secret-seed-${_uid}`")
    | Stellar Private Key/Secret
    sup
      a.margin-left-small.text-primary(
        href="https://developers.stellar.org/docs/tutorials/create-account/#create-a-keypair"
        target="_blank"
        rel="noopener noreferrer") (i)
  div
    div.input-group
      input.form-control(
        :id="`secret-seed-${_uid}`"
        :type="inputType"
        v-model="xlmSeed")
      div.input-group-append
        span.input-group-text
          a(
            style="cursor:pointer"
            @click="toggleType") show
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: "TTSecretSeed",

  data() {
    return {
      inputType: "password",
    };
  },

  computed: {
    xlmSeed: {
      get() {
        return this.$store.state.xlm.xlmSecretSeed;
      },

      set(newSeed) {
        this.$store.commit("SET_XLM_SECRET_SEED", newSeed);
        localStorage.xlmSeed = newSeed;
      },
    },
  },

  methods: {
    toggleType() {
      this.inputType = this.inputType === "text" ? "password" : "text";
    },
  },
};
</script>
