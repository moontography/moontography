<template lang="pug">
td
  div
    h6.m-0
      strong {{ tokenName }}
  div.text-secondary
    small {{ stakedTokenSymbol }}
td
  div
    h6.m-0
      strong {{ rewardsTokenName }}
  div.text-secondary
    small {{ rewardTokenSymbol }}
td.text-left
  div
    h6.m-0
      strong {{ stakedBalance }} {{ stakedTokenSymbol }} staked
  div.text-secondary
    small {{ remainingTokenBalance }} balance
td
  div
    strong {{ stakingApr || 0 }}%
  div
    small
      | {{ totalTokensStaked[1] }} staked
      | ({{ perBlockNumTokens }} {{ rewardTokenSymbol }}/block)
td
  div {{ row.item.lastStakableBlock }}
  div.text-secondary(v-if="estimateExpirationTime")
    small Estimated: {{ estimateExpirationTime }}
  div.text-danger(v-if="isFarmExpired")
    b EXPIRED FARM
td
  div.text-success.d-flex.align-items-center(v-if="isInFarm")
    i.text-success.fa.fa-check
    div.ml-1 {{ amountUnharvested[1] }}
    a.clickable.ml-1(@click="getUnharvestedTokens")
      i.fa.fa-refresh
    //- button.ml-3.btn.btn-sm.btn-primary(
    //-   v-loading="globalLoading"
    //-   :disabled="globalLoading"
    //-   @click="claimTokens") Claim
  div(v-else) ---
td.td-actions.text-right
  small
    n-button(
      type="success"
      icon
      round
      data-toggle="modal"
      :data-target="`#stake-modal-v1-${farmingTokenAddress}`")
        i.fa.fa-play
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
  :id="`stake-modal-v1-${farmingTokenAddress}`"
  :is-expired="isFarmExpired"
  :farm-address="farmingTokenAddress"
  @staked="reset")
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";
import AddRemoveStakeModal from "./AddRemoveStakeModal";
// import MTGYFaaS from "../../../factories/web3/MTGYFaaS";
import MTGYFaaSTokenV1 from "../../../../factories/web3/MTGYFaaSTokenV1";

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
      tokenInfo: null,
    };
  },

  computed: {
    ...mapState({
      blocksPerDay: (_, getters) => getters.activeNetwork.blocks_per_day,
      currentBlock: (state) => state.currentBlock,
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3.instance,
    }),

    isFarmExpired() {
      return (
        this.row.item.lastStakableBlock &&
        new BigNumber(this.row.item.lastStakableBlock).lte(this.currentBlock)
      );
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
        .toFormat(0);
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
    async claimTokens() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);

        await this.$store.dispatch(
          "faasHarvestTokens",
          this.farmingTokenAddress
        );
        this.$toast.success(`Successfully claimed your tokens!`);
        this.$emit("harvested");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async getUnharvestedTokens() {
      try {
        const stakingContract = MTGYFaaSTokenV1(
          this.web3,
          this.farmingTokenAddress
        );
        const stakingBalance = await stakingContract.methods
          .balanceOf(this.userAddy)
          .call();
        this.isInFarm = stakingBalance && stakingBalance > 0;

        const [
          amountUnharvested,
          totalTokensStaked,
          tokensStakedPerBlock,
        ] = await Promise.all([
          stakingContract.methods.calcHarvestTot(this.userAddy).call(),
          stakingContract.methods.totalTokensStaked().call(),
          stakingContract.methods.perBlockNum().call(),
        ]);
        this.amountUnharvested = [
          amountUnharvested,
          new BigNumber(amountUnharvested)
            .div(new BigNumber(10).pow(this.tokenInfo.decimals))
            .toFormat(2),
        ];
        this.totalTokensStaked = [
          totalTokensStaked,
          new BigNumber(totalTokensStaked)
            .div(new BigNumber(10).pow(this.tokenInfo.decimals))
            .toFormat(2),
        ];
        this.tokensStakedPerBlock = [
          tokensStakedPerBlock,
          new BigNumber(tokensStakedPerBlock)
            .div(new BigNumber(10).pow(this.tokenInfo.decimals))
            .toFormat(2),
        ];
      } catch (err) {
        console.error(`V1 token list error getting harvest tokens`, err);
        true;
      }
    },

    async reset() {
      await this.$store.dispatch("getAllStakingContracts");
      await this.getUnharvestedTokens();
    },
  },

  async mounted() {
    this.tokenInfo = await this.$store.dispatch(
      "getErc20TokenInfo",
      this.tokenAddress
    );
    await this.getUnharvestedTokens();

    // Modal appearing in table and below backgound on mobile
    $(`#stake-modal-v1-${this.farmingTokenAddress}`).appendTo("body");
  },

  beforeUnmount() {
    // See comments above as to why this needs to be here.
    $(`#stake-modal-v1-${this.farmingTokenAddress}`).remove();
  },
};
</script>
