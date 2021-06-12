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
  div.px-4(v-else-if="!tokenStakingContracts || tokenStakingContracts.length === 0")
    div.alert.alert-warning
      | No staking contracts available for this token yet.
  el-table(
    v-else
    :data='tokenStakingContracts')
      el-table-column(min-width='150' label='Symbol' property='currentTokenSymbol')
      el-table-column(min-width='150' label='Token' property='currentTokenName')
      //- el-table-column(min-width='150' label='Farming Token' property='farmingTokenName')
      el-table-column(min-width='150' label='Your Token Balance' property='currentTokenBalance')
      el-table-column(min-width='150' label='Your Staked Balance' property='farmingTokenBalance')
</template>

<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import MTGYFaaS from "../../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../../factories/web3/MTGYFaaSToken";

export default {
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
            const [tokenAddy, farmingInfo] = await Promise.all([
              tokenCont.methods.tokenAddress().call(),
              this.$store.dispatch("getErc20TokenInfo", farmingTokenAddy),
            ]);
            const {
              name,
              symbol,
              decimals,
              userBalance,
            } = await this.$store.dispatch("getErc20TokenInfo", tokenAddy);
            return {
              farmingTokenName: farmingInfo.name,
              farmingTokenSymbol: farmingInfo.symbol,
              farmingTokenBalance: new BigNumber(farmingInfo.userBalance)
                .div(new BigNumber(10).pow(farmingInfo.decimals))
                .toString(),
              currentTokenName: name,
              currentTokenSymbol: symbol,
              currentTokenBalance: new BigNumber(userBalance)
                .div(new BigNumber(10).pow(decimals))
                .toFixed(3),
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
