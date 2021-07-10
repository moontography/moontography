<template lang="pug">
div
  div(v-if="!faasAddy")
  div(v-else-if="isLoadingLocal")
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
      :columns="['Staked Token', 'Balances', 'Rewards', 'Expiration Block', 'Rewards', '']"
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
import MTGYFaaS from "../../../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../../../factories/web3/MTGYFaaSToken";

export default {
  components: {
    StakingTokensListRow,
  },

  data() {
    return {
      isLoadingLocal: false,
      showStakingTokens: false,
      tokenStakingContracts: [],
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
      faasAddy: (_, getters) => getters.activeNetwork.contracts.faas_V12,
      selectedTokenAddress: (state) => state.selectedAddressInfo.address,
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
        let tokenAddresses;
        this.isLoadingLocal = true;
        const contract = MTGYFaaS(this.web3, this.faasAddy);
        if (this.isAddyValid && this.selectedTokenAddress) {
          tokenAddresses = await contract.methods
            .getTokensForStaking(this.selectedTokenAddress)
            .call();
        } else {
          tokenAddresses = await contract.methods
            .getAllFarmingContracts()
            .call();
        }

        const stakingContracts = await Promise.all(
          tokenAddresses.map(async (farmingTokenAddy) => {
            try {
              const farmingCont = MTGYFaaSToken(this.web3, farmingTokenAddy);
              const [
                tokenAddy,
                rewardAddy,
                lastStakableBlock,
                poolInfo,
                contractIsRemoved,
                farmingInfo,
              ] = await Promise.all([
                farmingCont.methods.stakedTokenAddress().call(),
                farmingCont.methods.rewardsTokenAddress().call(),
                farmingCont.methods.getLastStakableBlock().call(),
                farmingCont.methods.pool().call(),
                farmingCont.methods.contractIsRemoved().call(),
                this.$store.dispatch("getErc20TokenInfo", farmingTokenAddy),
              ]);
              const [
                { name, symbol, decimals, userBalance },
                {
                  name: rewardName,
                  symbol: rewardSymbol,
                  decimals: rewardDecimals,
                  userBalance: rewardUserBalance,
                },
              ] = await Promise.all([
                this.$store.dispatch("getErc20TokenInfo", tokenAddy),
                this.$store.dispatch("getErc20TokenInfo", rewardAddy),
              ]);
              return {
                farmingTokenAddy,
                tokenAddy,
                lastStakableBlock,
                poolInfo,
                contractIsRemoved,
                farmingTokenName: farmingInfo.name,
                farmingTokenSymbol: farmingInfo.symbol,
                farmingTokenDecimals: farmingInfo.decimals,
                farmingTokenBalance: farmingInfo.userBalance,
                currentTokenName: name,
                currentTokenSymbol: symbol,
                currentTokenDecimals: decimals,
                currentTokenBalance: userBalance,
                rewardAddy,
                rewardTokenName: rewardName,
                rewardTokenSymbol: rewardSymbol,
                rewardTokenDecimals: rewardDecimals,
                rewardTokenBalance: rewardUserBalance,
              };
            } catch (err) {
              console.error(`error getting farming contract`, err);
              return null;
            }
          })
        );
        return (this.tokenStakingContracts = stakingContracts.filter(
          (c) => !!c
        ));
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
