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
  div.px-4.pt-3(v-else-if="!tokenStakingContracts || tokenStakingContracts.length === 0")
    div.alert.alert-warning
      | No staking contracts available {{ isAddyValid ? 'for this token' : '' }} yet.
  div.table-full-width.table-responsive.pb-0(v-else)
    n-table.mb-0(
      :columns="['Token', 'Balances', 'Rewards APR', 'Unclaimed', '']"
      :data='tokenStakingContracts')
        template(v-slot:columns)
        template(v-slot:default='row')
          staking-tokens-list-row(
            :row="row"
            @harvested="lookUpTokenStakingContracts")
</template>

<script>
import { mapState } from "vuex";
import StakingTokensListRow from "./StakingTokensListRow";
import MTGYFaaS from "../../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../../factories/web3/MTGYFaaSToken";

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
      faasAddy: (_, getters) => getters.activeNetwork.contracts.faas,
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

        this.tokenStakingContracts = await Promise.all(
          tokenAddresses.map(async (farmingTokenAddy) => {
            const tokenCont = MTGYFaaSToken(this.web3, farmingTokenAddy);
            const [tokenAddy, rewardAddy, farmingInfo] = await Promise.all([
              tokenCont.methods.stakedTokenAddress().call(),
              tokenCont.methods.rewardsTokenAddress().call(),
              this.$store.dispatch("getErc20TokenInfo", farmingTokenAddy),
            ]);
            const {
              name,
              symbol,
              decimals,
              userBalance,
            } = await this.$store.dispatch("getErc20TokenInfo", tokenAddy);
            const {
              name: rewardName,
              symbol: rewardSymbol,
              decimals: rewardDecimals,
              userBalance: rewardUserBalance,
            } = await this.$store.dispatch("getErc20TokenInfo", tokenAddy);
            return {
              farmingTokenAddy,
              tokenAddy,
              farmingTokenName: farmingInfo.name,
              farmingTokenSymbol: farmingInfo.symbol,
              farmingTokenDecimals: farmingInfo.decimals,
              farmingTokenBalance: farmingInfo.userBalance,
              currentTokenName: name,
              currentTokenSymbol: symbol,
              currentTokenDecimals: decimals,
              currentTokenBalance: userBalance,
              rewardTokenName: rewardName,
              rewardTokenSymbol: rewardSymbol,
              rewardTokenDecimals: rewardDecimals,
              rewardTokenBalance: rewardUserBalance,
            };
          })
        );
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
