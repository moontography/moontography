<template lang="pug">
div
  div.row.flex-center.mb-2
    div.col.col-fill
      div.form-group.d-flex.justify-content-center.mb-2
        img.img-fluid(
          style="max-width: 25%"
          src="img/logo-nn.png")
      div.text-center
        h1 Coming Soon!
        slot
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ComingSoonCard",

  components: {},

  data() {
    return {};
  },

  computed: {
    ...mapState({}),
  },

  methods: {},
};
</script>
