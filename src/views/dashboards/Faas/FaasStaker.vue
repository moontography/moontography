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
              token-input(btn-text="Retrieve Farms for Token")
            div.card-body.table-full-width.py-0.border-top
              staking-tokens-list

        card(v-if="faasAddyV13")
          template(v-slot:header='')
            h4.card-title.m-0
              | v1.3 Farms
          template(v-slot:raw-content="")
            div.card-body.table-full-width.py-0.mt-3.border-top
              staking-tokens-list-v13
        
        card(v-if="faasAddyV12")
          template(v-slot:header='')
            h4.card-title.m-0
              | v1.2 Farms
          template(v-slot:raw-content="")
            div.card-body.table-full-width.py-0.mt-3.border-top
              staking-tokens-list-v12

</template>
<script>
import { mapState } from "vuex";
import StakingTokensListV12 from "./V12/StakingTokensList.vue";
import StakingTokensListV13 from "./V13/StakingTokensList.vue";
import StakingTokensList from "./StakingTokensList.vue";

export default {
  components: {
    StakingTokensListV12,
    StakingTokensListV13,
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
      faasAddyV12: (_, getters) => getters.activeNetwork.contracts.faas_V12,
      faasAddyV13: (_, getters) => getters.activeNetwork.contracts.faas_V13,
      userAddy: (state) => state.web3.address,
    }),
  },
};
</script>
