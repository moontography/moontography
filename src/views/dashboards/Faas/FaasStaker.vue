<template lang="pug">
.row
  .col-md-12.mx-auto
    div.alert.alert-danger(v-if="localError")
      | | {{ localError.message }}
    div.row
      div.col-lg-12.mx-auto
        card
          template(v-slot:header='')
            h4.card-title
              | Find a Token to Farm and Earn
          template(v-slot:raw-content="")
            div
              token-input(
                btn-size="sm"
                btn-text="Retrieve Farms for Token")
            div.card-body.table-full-width.py-0.border-top
              staking-tokens-list

        card.mt-4
          template(v-slot:header='')
            h4.card-title.m-0
              | V1 Farms
            div.text-danger.mt-2(style="line-height: 1;")
              small
                i
                  | YOU CAN ONLY UNSTAKE TOKENS YOU'VE STAKED FROM THESE POOLS. PLEASE
                  | ONLY STAKE TOKENS IN THE NEW POOLS IN THE LIST ABOVE.
          template(v-slot:raw-content="")
            div.card-body.table-full-width.py-0.mt-3.border-top
              staking-tokens-list-v1

</template>
<script>
import { mapState } from "vuex";
import StakingTokensListV1 from "./V1/StakingTokensList.vue";
import StakingTokensList from "./StakingTokensList.vue";
import MTGYFaaS from "../../../factories/web3/MTGYFaaS";

export default {
  components: {
    StakingTokensListV1,
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
      web3Provider: (state) => state.web3.provider,
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
