<template lang="pug">
.row
  .col-md-12.mx-auto
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
    div.row(v-else)
      div.col-xl-10.mx-auto
        card
          template(v-slot:header='')
            h4.card-title
              | Find a Token to Farm and Earn
          template(v-slot:raw-content="")
            div
              token-input.px-3.mb-3(btn-text="Retrieve Farms for Token")
            div.card-body.table-full-width.py-0.border-top
              staking-tokens-list

</template>
<script>
import { mapState } from "vuex";
import StakingTokensList from "./StakingTokensList.vue";

export default {
  components: {
    StakingTokensList,
  },

  props: {
    tokenAddress: { type: String, default: null },
  },

  data() {
    return {
      activeTab: "Profile",
      localError: null,
    };
  },

  computed: {
    ...mapState({
      userAddy: (state) => state.web3.address,
    }),
  },
};
</script>
