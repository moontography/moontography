<template lang="pug">
td
  template(v-if="lp.token0Info")
    h6.m-0
        strong
          a(
            :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${tokenAddress}`"
            target="_blank"
            rel="noopener noreferrer")
              | LP - {{ lp.token0Info.symbol }} / {{ lp.token1Info.symbol }}
    div.text-secondary
      small {{ lp.token0Info.symbol }} LP Farming
  template(v-else)
    div
      h6.m-0
        strong
          a(
            :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${tokenAddress}`"
            target="_blank"
            rel="noopener noreferrer")
              | {{ row.item.poolInfo.isStakedNft ? 'NFT -' : '' }}
              | {{ stakedTokenSymbol }}
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
          rel="noopener noreferrer")
            | {{ stakedBalance }} {{ stakedTokenSymbol }} {{ frozenOrStaked }}
  div.text-secondary
    small {{ remainingTokenBalance }} {{ stakedTokenSymbol }} balance
td.d-none.d-lg-table-cell
  div(v-if="!isFrozen")
    strong
      | {{ `${stakingApr || 0}% APR` }}
  div.text-secondary
    small
      div
        a(
          :href="`${activeNetworkExplorerUrl}/${tokenRoute}/${rewardsTokenAddress}`"
          target="_blank"
          rel="noopener noreferrer") {{ perBlockTokensRewarded }} {{ rewardTokenSymbol }}/block
      div
        | {{ row.item.poolInfo.isStakedNft ? totalTokensStaked[0] : totalTokensStaked[1] }}
        | {{ stakedTokenSymbol }} {{ frozenOrStaked }}
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
  div(v-else) ---
td.td-actions.text-right
  small
    n-button.mr-2(
      v-if="row.item.farmingTokenBalance > 0 && isPastTimelock"
      type="info"
      round
      @click="harvestTokens")
        i.fa.fa-money
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
  @staked="init(true)")
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { mapState } from "vuex";
import AddRemoveStakeModal from "./AddRemoveStakeModal";
import TokenDataUtils from "../../../factories/TokenDataUtils";
import OKLGFaaSToken from "../../../factories/web3/OKLGFaaSToken";

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
      tokensRewardedPerBlock: [],
      amountUnharvested: [],
      totalTokensStaked: [],

      lp: {
        token0Info: null,
        token0Price: null,
        token1Info: null,
        pairValuePerTokenUSD: null,
      },

      rewardsTokenPriceUSD: 0,
      stakingTokenPriceUSD: 0,

      harvestAlert: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),
    };
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork,
      activeNetworkExplorerUrl: (_, getters) =>
        getters.activeNetworkExplorerUrl,
      tokenRoute: (_, getters) => getters.tokenRoute,
      blocksPerDay: (_, getters) => getters.activeNetwork.blocks_per_day,
      currentBlock: (state) => state.currentBlock,
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3.instance,
    }),

    isFrozen() {
      return [
        "0xFB7D9c478b2F8B1d07Ad196076c881f11F370Ca4".toLowerCase(),
      ].includes(this.row.item.farmingTokenAddy.toLowerCase());
    },

    isPastTimelock() {
      const stakingInfo = this.row.item;
      if (!stakingInfo) return true;

      const timelockSeconds = stakingInfo.poolInfo.stakeTimeLockSec;
      if (!timelockSeconds) return true;

      const userStakedTime =
        stakingInfo.stakerInfo && stakingInfo.stakerInfo.timeOriginallyStaked;
      if (!userStakedTime) return true;

      const isPastTime = dayjs(
        new BigNumber(userStakedTime).times(1e3).toNumber()
      )
        .add(timelockSeconds, "seconds")
        .isBefore(dayjs());
      if (isPastTime) return true;

      if (this.isFarmExpired) return true;

      return false;
    },

    frozenOrStaked() {
      return !this.isFrozen ? "staked" : "frozen";
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

    perBlockTokensRewarded() {
      return new BigNumber(this.tokensRewardedPerBlock[0] || 0)
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

    farmingTokenSymbol() {
      return this.row.item.farmingTokenSymbol;
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

    stakedTokenDecimals() {
      return this.row.item.currentTokenDecimals;
    },

    stakedTokenAddress() {
      return this.tokenAddress;
    },

    stakedTokenSymbol() {
      return this.row.item.currentTokenSymbol;
    },

    stakedBalance() {
      return this.row.item.poolInfo.isStakedNft
        ? this.row.item.farmingTokenBalance
        : new BigNumber(this.row.item.farmingTokenBalance)
            .div(new BigNumber(10).pow(this.row.item.farmingTokenDecimals))
            .times(
              new BigNumber(10).pow(
                this.row.item.farmingTokenDecimals - this.tokenDecimals
              )
            )
            .toFormat(0, BigNumber.ROUND_DOWN);
    },

    remainingTokenBalance() {
      return this.row.item.poolInfo.isStakedNft
        ? this.row.item.currentTokenBalance
        : new BigNumber(this.row.item.currentTokenBalance)
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
      const totalStakedBalanceUSD = new BigNumber(
        this.totalTokensStaked[0] || 0
      )
        .times(
          this.lp.pairValuePerTokenUSD
            ? this.lp.pairValuePerTokenUSD
            : this.stakingTokenPriceUSD
        )
        .div(new BigNumber(10).pow(this.stakedTokenDecimals));
      const perBlockRewardedAmountUSD = new BigNumber(
        this.tokensRewardedPerBlock[0] || 0
      )
        .times(this.rewardsTokenPriceUSD)
        .div(new BigNumber(10).pow(this.rewardsTokenDecimals));
      if (totalStakedBalanceUSD.eq(0) || perBlockRewardedAmountUSD.eq(0))
        return 0;

      const tokensStakablePerYear = perBlockRewardedAmountUSD
        .times(blocksPerDay)
        .times(365);
      const userStakablePerYear = userStakedTokens
        .div(totalStakedBalanceUSD)
        .times(tokensStakablePerYear);
      const apr = userStakablePerYear
        .div(userStakedTokens)
        .times(100)
        .toFormat(2);
      return apr;
    },
  },

  methods: {
    async getBothTokenPricesUSD() {
      // TODO check if either token is an LP token and handle it separately

      // 1. get both staking and rewards token information
      const [stakingTokenAddress, stakingTokenSymbol] = [
        this.stakedTokenAddress,
        this.stakedTokenSymbol,
      ];
      const [rewardsTokenAddress, rewardsTokenSymbol] = [
        this.rewardsTokenAddress,
        this.rewardTokenSymbol,
      ];

      const getTokenPriceFailSilently = async (symbol, addy) => {
        try {
          return await TokenDataUtils.getTokenPriceUSD(
            this.activeNetwork.short_name,
            symbol,
            addy
          );
        } catch (err) {
          return 0;
        }
      };

      const [sp, rp] = await Promise.all([
        getTokenPriceFailSilently(stakingTokenSymbol, stakingTokenAddress),
        getTokenPriceFailSilently(rewardsTokenSymbol, rewardsTokenAddress),
      ]);
      this.stakingTokenPriceUSD = sp;
      this.rewardsTokenPriceUSD = rp;
    },

    async init(resetAll = false) {
      if (resetAll) {
        await this.$store.dispatch("getAllStakingContracts");
      }
      await this.getUnharvestedTokens();
      await this.getBothTokenPricesUSD();
    },

    async checkAndUpdateIfLpFarm() {
      const lpTokenInfo = await this.$store.dispatch(
        "getLpTokenInfo",
        this.row.item.tokenAddy
      );
      if (!lpTokenInfo.token0Info) return;
      this.lp = lpTokenInfo;
    },

    async harvestTokens() {
      try {
        const { isConfirmed } = await this.harvestAlert.fire({
          title: "<span class='text-primary'>Claim Rewards!</span>",
          html: `
                <div>
                  By confirming you will retrieve any unclaimed rewards, but
                  this will not unstake currently staked tokens nor compound
                  the rewards for you (compounding will come in the future).
                </div>
              `,
          confirmButtonText: "Yes, claim my rewards!",
          cancelButtonText: "Cancel, do not claim.",
          showCancelButton: true,
        });
        if (!isConfirmed) return;

        this.$store.commit("SET_GLOBAL_LOADING", true);
        if (new BigNumber(this.row.item.farmingTokenBalance).lte(0))
          throw new Error(`You do not have any rewards to harvest.`);

        await this.$store.dispatch("faasHarvestTokens", {
          farmingContractAddress: this.farmingTokenAddress,
        });
        await this.init(true);
      } catch (err) {
        console.error(`Error harvesting tokens`, err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async getUnharvestedTokens() {
      try {
        const stakingContract = OKLGFaaSToken(
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
        this.tokensRewardedPerBlock = [
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
    try {
      await this.init();
    } catch (err) {
      console.error(`error with list row init`, err);
    } finally {
      // Modal appearing in table and below backgound on mobile
      $(`#stake-modal-${this.farmingTokenAddress}`).appendTo("body");
    }
    await this.checkAndUpdateIfLpFarm();
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
