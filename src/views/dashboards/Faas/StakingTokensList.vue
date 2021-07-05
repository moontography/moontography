<template lang="pug">
div
  div(v-if="isLoadingLocal")
    loading-panel
  div.px-4(v-else-if="!web3")
    div.alert.alert-danger
      | Please connect to your wallet.
  //- div.px-4(v-else-if="!isAddyValid")
  //-   div.alert.alert-danger
  //-     | Enter a valid address to search for farms.
  div.px-4.py-3(v-else-if="!filteredStakingContracts || filteredStakingContracts.length === 0")
    i
      | No staking contracts available {{ isAddyValid ? 'for this token' : '' }} yet.
  div.table-full-width.table-responsive.pb-0(v-else)
    n-table.mb-0(
      :columns="['Staked Token', 'Rewards Token', 'Balances', 'Rewards APR', 'Expiration Block', 'Rewards', '']"
      :data='filteredStakingContracts')
        template(v-slot:columns)
        template(v-slot:default='row')
          staking-tokens-list-row(
            :row="row"
            @harvested="lookUpTokenStakingContracts")
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import StakingTokensListRow from "./StakingTokensListRow";

export default {
  components: {
    StakingTokensListRow,
  },

  data() {
    return {
      isLoadingLocal: false,
      showStakingTokens: false,
    };
  },

  watch: {
    async isAddyValid(isValid) {
      if (isValid) await this.lookUpTokenStakingContracts();
    },
  },

  computed: {
    ...mapState({
      currentBlock: (state) => state.currentBlock,
      selectedTokenAddress: (state) => state.selectedAddressInfo.address,
      tokenStakingContracts: (state) => state.faas.tokenStakingContracts,
      web3: (state) => state.web3.instance,
    }),

    isAddyValid() {
      return (
        this.selectedTokenAddress &&
        this.web3 &&
        this.web3.utils.isAddress(this.selectedTokenAddress)
      );
    },

    filteredStakingContracts() {
      return this.tokenStakingContracts
        .slice(0)
        .filter((c) => {
          return (
            (c.lastStakableBlock &&
              new BigNumber(c.lastStakableBlock).gt(this.currentBlock)) ||
            new BigNumber(c.farmingTokenBalance).gt(0)
          );
        })
        .filter(
          (c) =>
            !(
              c.contractIsRemoved && new BigNumber(c.farmingTokenBalance).lte(0)
            )
        );
    },
  },

  methods: {
    async lookUpTokenStakingContracts() {
      try {
        this.isLoadingLocal = true;
        await this.$store.dispatch("getAllStakingContracts");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.isLoadingLocal = false;
      }
    },
  },

  async mounted() {
    await this.lookUpTokenStakingContracts();
  },
};
</script>
