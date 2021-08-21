<template lang="pug">
td
  div
    h6.m-0
      strong
        a(
          :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${tokenAddress}`"
          target="_blank"
          rel="noopener noreferrer") {{ stakedTokenSymbol }}
  div.text-secondary
    small {{ tokenName }}
  div.text-danger(v-if="timelockDays && timelockDays > 0")
    b {{ timelockDays }} day timelock
//- td
//-   div
//-     h6.m-0
//-       strong
//-         a(
//-           :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${rewardsTokenAddress}`"
//-           target="_blank"
//-           rel="noopener noreferrer") {{ rewardTokenSymbol }}
  div.text-secondary
    small {{ rewardsTokenName }}
td.text-left
  div
    h6.m-0
      strong
        a(
          :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${farmingTokenAddress}`"
          target="_blank"
          rel="noopener noreferrer") {{ stakedBalance }} {{ stakedTokenSymbol }} {{ frozenOrStaked }}
  div.text-secondary
    small {{ remainingTokenBalance }} {{ stakedTokenSymbol }} balance
td.d-none.d-lg-table-cell
  div
    strong
      | {{ stakedTokenSymbol == rewardTokenSymbol ? `${stakingApr || 0}% APR` : 'APR Coming Soon' }}
  div.text-secondary
    small
      div
        a(
          :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${rewardsTokenAddress}`"
          target="_blank"
          rel="noopener noreferrer") {{ perBlockNumTokens }} {{ rewardTokenSymbol }}/block
      div {{ totalTokensStaked[1] }} {{ stakedTokenSymbol }} {{ frozenOrStaked }}
td.d-none.d-lg-table-cell
  div Block: {{ row.item.lastStakableBlock }}
  div.text-secondary(v-if="estimateExpirationTime")
    small Est: {{ estimateExpirationTime }}
  div.text-danger(v-if="isFarmExpired")
    b EXPIRED FARM
td
  div.text-success.d-flex.align-items-center(v-if="isInFarm")
    template(v-if="!contractIsRemoved")
      i.text-success.fa.fa-check
      div.ml-1 {{ amountUnharvested[1] }} {{ rewardTokenSymbol }}
      a.clickable.ml-1(@click="getUnharvestedTokens")
        i.fa.fa-refresh
    div.text-dark(v-else)
      i Removed
    //- button.ml-3.btn.btn-sm.btn-primary(
    //-   v-loading="globalLoading"
    //-   :disabled="globalLoading"
    //-   @click="claimTokens") Claim
  div(v-else) ---
td.td-actions.text-right
  small
    n-button(
      type="success"
      round
      data-toggle="modal"
      :data-target="`#stake-modal-${farmingTokenAddress}`")
        span #[i.fa.fa-minus] / #[i.fa.fa-plus]
    //- a.text-danger.clickable.mr-1(
    //-   v-if="isInFarm"
    //-   data-toggle="modal"
    //-   data-target="")
    //-     i.fa.fa-2x.fa-minus-circle
    //- a.text-success.clickable(
    //-   data-toggle="modal"
    //-   data-target="")
    //-     i.fa.fa-2x.fa-plus-circle

add-remove-stake-modal(
  :id="`stake-modal-${farmingTokenAddress}`"
  :is-expired="isFarmExpired"
  :farm-address="farmingTokenAddress"
  @staked="init")
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";
import AddRemoveStakeModal from "./AddRemoveStakeModal";
// import MTGYFaaS from "../../../factories/web3/MTGYFaaS";
import MTGYFaaSToken from "../../../factories/web3/MTGYFaaSToken";

export default {
  props: {
    row: { type: Object, required: true },
  },

  components: {
    AddRemoveStakeModal,
  },

  emits: ["harvested"],

  data() {
    return {
      isInFarm: false,
      tokensStakedPerBlock: [],
      amountUnharvested: [],
      totalTokensStaked: [],
    };
  },

  computed: {
    ...mapState({
      activeNetworkExplorerUrl: (_, getters) =>
        getters.activeNetworkExplorerUrl,
      blocksPerDay: (_, getters) => getters.activeNetwork.blocks_per_day,
      currentBlock: (state) => state.currentBlock,
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3.instance,
    }),

    frozenOrStaked() {
      return ![
        "0xFB7D9c478b2F8B1d07Ad196076c881f11F370Ca4".toLowerCase(),
      ].includes(this.row.item.farmingTokenAddy.toLowerCase())
        ? "staked"
        : "frozen";
    },

    tokenRoute() {
      return this.activeNetworkExplorerUrl === "https://explorer.kcc.io/en"
        ? "tokentxns"
        : "token";
    },

    isFarmExpired() {
      return (
        this.row.item.lastStakableBlock &&
        new BigNumber(this.row.item.lastStakableBlock).lte(this.currentBlock)
      );
    },

    timelockDays() {
      const timelockSeconds = this.row.item.poolInfo.stakeTimeLockSec;
      if (!timelockSeconds) return 0;
      return new BigNumber(timelockSeconds).div(60).div(60).div(24).toFormat();
    },

    estimateExpirationTime() {
      const currentBlock = this.currentBlock;
      const lastBlock = this.row.item.lastStakableBlock;
      const blocksPerSecond = new BigNumber(this.blocksPerDay)
        .div(24)
        .div(60)
        .div(60);
      if (new BigNumber(lastBlock).lt(currentBlock)) return;

      const secondsFromNow = new BigNumber(
        new BigNumber(lastBlock).minus(currentBlock)
      ).div(blocksPerSecond);
      return dayjs().add(secondsFromNow, "seconds").format("MMM D, YYYY HH:mm");
    },

    perBlockNumTokens() {
      return new BigNumber(this.tokensStakedPerBlock[0] || 0)
        .div(new BigNumber(10).pow(this.row.item.farmingTokenDecimals))
        .times(
          new BigNumber(10).pow(
            this.row.item.farmingTokenDecimals - this.rewardsTokenDecimals
          )
        )
        .toFormat(2);
    },

    contractIsRemoved() {
      return this.row.item.contractIsRemoved;
    },

    farmingTokenAddress() {
      return this.row.item.farmingTokenAddy;
    },

    tokenAddress() {
      return this.row.item.tokenAddy;
    },

    tokenName() {
      return this.row.item.currentTokenName;
    },

    tokenDecimals() {
      return this.row.item.currentTokenDecimals;
    },

    rewardsTokenAddress() {
      return this.row.item.rewardAddy;
    },

    rewardsTokenDecimals() {
      return this.row.item.rewardTokenDecimals;
    },

    rewardsTokenName() {
      return this.row.item.rewardTokenName;
    },

    rewardTokenSymbol() {
      return this.row.item.rewardTokenSymbol;
    },

    stakedTokenSymbol() {
      return this.row.item.currentTokenSymbol;
    },

    stakedBalance() {
      return new BigNumber(this.row.item.farmingTokenBalance)
        .div(new BigNumber(10).pow(this.row.item.farmingTokenDecimals))
        .times(
          new BigNumber(10).pow(
            this.row.item.farmingTokenDecimals - this.tokenDecimals
          )
        )
        .toFormat(0, BigNumber.ROUND_DOWN);
    },

    remainingTokenBalance() {
      return new BigNumber(this.row.item.currentTokenBalance)
        .div(new BigNumber(10).pow(this.row.item.currentTokenDecimals))
        .toFormat(0, BigNumber.ROUND_DOWN);
    },

    stakingApr() {
      const blocksPerDay = new BigNumber(this.blocksPerDay);
      const userStakedTokens = new BigNumber(
        new BigNumber(this.row.item.farmingTokenBalance).gt(0)
          ? this.row.item.farmingTokenBalance
          : new BigNumber(this.totalTokensStaked[0]).div(500)
      );
      const totalStakedBalance = new BigNumber(this.totalTokensStaked[0] || 0);
      const perBlockAmount = new BigNumber(this.tokensStakedPerBlock[0] || 0);
      if (totalStakedBalance.toString() === "0") return 0;

      const tokensStakablePerYear = perBlockAmount
        .times(blocksPerDay)
        .times(365);
      const userStakablePerYear = userStakedTokens
        .div(totalStakedBalance)
        .times(tokensStakablePerYear);
      const apr = userStakablePerYear
        .div(userStakedTokens)
        .times(100)
        .toFormat(2);
      return apr;
    },
  },

  methods: {
    // async claimTokens() {
    //   try {
    //     this.$store.commit("SET_GLOBAL_LOADING", true);

    //     await this.$store.dispatch(
    //       "faasHarvestTokens",
    //       this.farmingTokenAddress
    //     );
    //     this.$toast.success(`Successfully claimed your tokens!`);
    //     this.$emit("harvested");
    //   } catch (err) {
    //     this.$toast.error(err.message);
    //   } finally {
    //     this.$store.commit("SET_GLOBAL_LOADING", false);
    //   }
    // },

    async init() {
      await this.$store.dispatch("getAllStakingContracts");
      await this.getUnharvestedTokens();
    },

    async getUnharvestedTokens() {
      try {
        const stakingContract = MTGYFaaSToken(
          this.web3,
          this.farmingTokenAddress
        );
        const stakingBalance = await stakingContract.methods
          .balanceOf(this.userAddy)
          .call();
        this.isInFarm = stakingBalance && stakingBalance > 0;

        const [amountUnharvested, pool] = await Promise.all([
          stakingContract.methods.calcHarvestTot(this.userAddy).call(),
          stakingContract.methods.pool().call(),
        ]);
        this.amountUnharvested = [
          amountUnharvested,
          new BigNumber(amountUnharvested)
            .div(new BigNumber(10).pow(this.rewardsTokenDecimals))
            .toFormat(2),
        ];
        this.totalTokensStaked = [
          pool.totalTokensStaked,
          new BigNumber(pool.totalTokensStaked)
            .div(new BigNumber(10).pow(this.tokenDecimals))
            .toFormat(2),
        ];
        this.tokensStakedPerBlock = [
          pool.perBlockNum,
          new BigNumber(pool.perBlockNum)
            .div(new BigNumber(10).pow(this.tokenDecimals))
            .toFormat(2),
        ];
      } catch (err) {
        console.error(`Error getting unharvested`, err);
        true;
      }
    },
  },

  async mounted() {
    await this.init();

    // Modal appearing in table and below backgound on mobile
    $(`#stake-modal-${this.farmingTokenAddress}`).appendTo("body");
  },

  beforeUnmount() {
    // See comments above as to why this needs to be here.
    $(`#stake-modal-${this.farmingTokenAddress}`).remove();
  },
};
</script>

<style lang="scss">
.table {
  small {
    font-weight: 600 !important;
  }
}
</style>
