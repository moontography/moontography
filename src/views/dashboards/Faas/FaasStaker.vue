<template lang="pug">
.row
  .col-md-10.mx-auto
    div.row
      div.col-lg-9
        card
          template(v-slot:header='')
            h4.card-title
              | Find a Token to Farm and Earn
          div
            token-input(@input="lookUpTokenStakingContracts")
      div.col-lg-3
        card
          template(v-slot:header='')
            h4.card-title
              | Your Farms
          div list of tokens you're in
          //- tabs(type='primary' v-model:value='activeTab')
          //-   tab-pane(label='Profile')
          //-     | Collaboratively administrate empowered markets via plug-and-play
          //-     | networks. Dynamically procrastinate B2C users after installed base
          //-     | benefits.
          //-     br
          //-     br
          //-     |               Dramatically visualize customer directed convergence without
          //-     |               revolutionary ROI.
          //-   tab-pane(label='Settings')
          //-     | Efficiently unleash cross-media information without cross-media
          //-     | value. Quickly maximize timely deliverables for real-time schemas.
          //-     br
          //-     br
          //-     | Dramatically maintain clicks-and-mortar solutions
          //-     |               without functional solutions.
          //-   tab-pane(label='Options')
          //-     | Completely synergize resource taxing relationships via premier
          //-     | niche markets. Professionally cultivate one-to-one customer
          //-     | service with robust ideas.
          //-     br
          //-     br
          //-     | Dynamically innovate resource-leveling customer
          //-     |               service for state of the art customer service.

</template>
<script>
import { mapState } from "vuex";
import MTGYFaaS from "../../../factories/web3/MTGYFaaS";

export default {
  props: {
    tokenAddress: { type: String, default: null },
  },

  data() {
    return {
      activeTab: "Profile",
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (state) => state.activeNetwork,
      web3: (state) => state.web3.instance,
      faasAddy: (_, getters) => getters.activeNetwork.contracts.faas,
      userAddy: (state) => state.web3.address,
    }),
  },

  methods: {
    async lookUpTokenStakingContracts(tokenAddy) {
      const contract = MTGYFaaS(this.web3, this.faasAddy);
      // await contract.methods.userStakingContracts(this.userAddy, 0).call()
      const firstFaasTokenAddy = await contract.methods
        .tokensUpForStaking(tokenAddy, 0)
        .call();
      // TODO get a list of all faas tokens for this token and show to the user
    },
  },
};
</script>
