<template lang="pug">
.row
  .col-md-12.mx-auto
    div.alert.alert-danger(v-if="localError")
      | | {{ localError.message }}
    div.row
      div.col-lg-8
        card
          template(v-slot:header='')
            h4.card-title
              | Find a Token to Farm and Earn
          template(v-slot:raw-content="")
            div
              token-input
            div.card-body.table-full-width.pb-0.border-top
              staking-tokens-list
      div.col-lg-4
        card
          template(v-slot:header='')
            h4.card-title
              | Your Farms
          template(v-slot:raw-content="")
            div.card-body(v-if="userStakingContractsCleaned.length === 0")
              i You're not in any farms yet!
            div.card-body.table-full-width.py-0(v-else)
              el-table(:data='userStakingContractsCleaned')
                el-table-column(min-width='150' label='Contract' property='contract')
                //- el-table-column(min-width='150' label='Country' property='country')
                //- el-table-column(min-width='150' label='City' property='city')
                //- el-table-column(min-width='150' align='right' header-align='right' label='Salary' property='salary')

</template>
<script>
import { mapState } from "vuex";
import StakingTokensList from "./StakingTokensList.vue";
import MTGYFaaS from "../../../factories/web3/MTGYFaaS";

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
      userStakingContracts: [],
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (state) => state.activeNetwork,
      web3: (state) => state.web3.instance,
      faasAddy: (_, getters) => getters.activeNetwork.contracts.faas,
      userAddy: (state) => state.web3.address,
    }),

    userStakingContractsCleaned() {
      return this.userStakingContracts.map((c) => ({ contract: c }));
    },
  },

  methods: {
    async getUserStakingContracts() {
      const contract = MTGYFaaS(this.web3, this.faasAddy);
      const tokensUserIsTaking = await contract.methods
        .getUserStakingContracts(this.userAddy)
        .call();
      this.userStakingContracts = tokensUserIsTaking;
    },
  },

  async mounted() {
    try {
      if (!this.userAddy) return;
      await this.getUserStakingContracts();
    } catch (err) {
      this.localError = err;
    }
  },
};
</script>
