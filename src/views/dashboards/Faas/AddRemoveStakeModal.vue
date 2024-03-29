<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='add-remove-stake-modal'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Add/Remove {{ isFrozen ? 'Frozen' : 'Staked' }} Tokens
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="isLoadingLocal")
          div.text-center(v-else)
            div
              div.card-category
                | Farm contract:
                | {{ farmAddress }}
              div You will {{ isFrozen ? 'freeze' : 'stake' }}:
            h1.card-title {{ stakingInfo.stakingTokenInfo.symbol }}
            h3.card-category
              div {{ stakingInfo.stakingTokenInfo.name }}
              div
                | {{ stakingInfo.stakingTokenInfo.symbol }} token contract:
                | {{ stakingInfo.stakingTokenInfo.address }}
            p
              | You and any other stakers will be rewarded #[strong {{ getRewardsTokens(stakingInfo.tokensRewardedPerBlock) }}]
              | {{ stakingInfo.rewardsTokenInfo.symbol }} per block in aggregate.

            div.card-footer
              - // Staking token is ERC721
              template(v-if="stakingInfo.poolInfo.isStakedNft")
                div.mb-2 Select NFT's you would like to stake:
                div.row(v-if="allUserNftTokens && allUserNftTokens.length > 0")
                  nft-selector.col-6.col-lg-3.mb-2.clickable(
                    v-for="nft in allUserNftTokens"
                    :nft="nft"
                    :is-selected="isNftSelected(nft.token_id)"
                    @select="toggleNft")
                div(v-else)
                  b No NFT's found
                    
              - // Staking token is ERC20
              template(v-else)
                div(v-if="!isExpired")
                  | You can {{ isFrozen ? 'freeze' : 'stake' }} up to #[strong {{ userStakingBalance }}]
                  | {{ stakingInfo.stakingTokenInfo.symbol }}
                slider-input-percent(
                  :max-amount="stakingInfo.poolInfo.isStakedNft ? null : maxAmountCanStakeHuman"
                  v-model="percAmountToStake")
                //- div {{ formattedAmountToStake }}

              div
                n-button(
                  v-if="!isExpired"
                  type="success"
                  size="lg"
                  v-loading="globalLoading"
                  :disabled="globalLoading || !canStake"
                  @click="stakeTokens")
                    | {{ isFrozen ? 'Freeze' : 'Stake' }}
                    | {{ formattedAmountToStake }} {{ stakingInfo.stakingTokenInfo.symbol }}
              template(v-if="hasStakedTokens")
                div.text-danger.mt-4(v-if="!isPastTimelock")
                  b
                    | This farm has a {{ timelockDays }} day timelock. You originally staked at {{ timeUserOriginallyStaked }}
                    | and will be able to unstake your tokens after {{ timeUserCanUnstake }}.
                div.d-flex.align-items-center.mt-4
                  a.clickable.text-danger(
                    v-if="isPastTimelock"
                    v-loading="globalLoading"
                    @click="unstakeTokens(!contractIsRemoved)") Unstake and Claim Rewards
                  //- n-button.mt-4(
                  //-   type="danger"
                  //-   size="sm"
                  //-   v-loading="globalLoading"
                  //-   :disabled="globalLoading"
                  //-   @click="unstakeTokens") Unstake Tokens Currently Staked
                  div.ml-auto(v-if="shouldShowEmergencyUnstake")
                    a.text-danger.clickable(
                      v-loading="globalLoading"
                      @click="unstakeTokens(false)")
                        i.fa.fa-exclamation-triangle.mr-1
                        span Emergency Unstake!
</template>

<script>
import $ from "jquery";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import Swal from "sweetalert2";
import { mapState } from "vuex";

export default {
  name: "AddRemoveStakeModal",

  props: {
    farmAddress: { type: String, default: null },
    isExpired: { type: Boolean, default: false },
  },

  emits: ["staked"],

  watch: {
    farmAddress() {},
  },

  data() {
    return {
      isLoadingLocal: true,
      percAmountToStake: 0,
      stakingInfo: {},
      allUserNftTokens: [],
      selectedNftTokenIds: [],

      emergencyUnstake: Swal.mixin({
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
      }),
    };
  },

  computed: {
    ...mapState({
      // cost: (state) => state.passwordManager.cost,
      activeNetwork: (_, getters) => getters.activeNetwork,
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
    }),

    canStake() {
      return this.stakingInfo.poolInfo.isStakedNft
        ? this.selectedNftTokenIds.length > 0
        : this.percAmountToStake > 0;
    },

    isPastTimelock() {
      if (!this.stakingInfo) return true;

      const timelockSeconds = this.stakingInfo.poolInfo.stakeTimeLockSec;
      if (!timelockSeconds) return true;

      const userStakedTime =
        this.stakingInfo.stakerInfo &&
        this.stakingInfo.stakerInfo.timeOriginallyStaked;
      if (!userStakedTime) return true;

      const isPastTime = dayjs(
        new BigNumber(userStakedTime).times(1e3).toNumber()
      )
        .add(timelockSeconds, "seconds")
        .isBefore(dayjs());
      if (isPastTime) return true;

      if (this.isExpired) return true;

      return false;
    },

    contractIsRemoved() {
      return this.stakingInfo.contractIsRemoved;
    },

    timelockDays() {
      const timelockSeconds = this.stakingInfo.poolInfo.stakeTimeLockSec;
      if (!timelockSeconds) return 0;
      return new BigNumber(timelockSeconds).div(60).div(60).div(24).toFormat();
    },

    isFrozen() {
      return [
        "0xFB7D9c478b2F8B1d07Ad196076c881f11F370Ca4".toLowerCase(),
      ].includes(this.farmAddress.toLowerCase());
    },

    shouldShowEmergencyUnstake() {
      return !this.isFrozen;
    },

    timeUserOriginallyStaked() {
      const userStakedTime = this.stakingInfo.stakerInfo.timeOriginallyStaked;
      return dayjs(new BigNumber(userStakedTime).times(1e3).toNumber()).format(
        "MMMM Do, YYYY HH:mm:ss"
      );
    },

    timeUserCanUnstake() {
      const timelockSeconds = this.stakingInfo.poolInfo.stakeTimeLockSec;
      const userStakedTime = this.stakingInfo.stakerInfo.timeOriginallyStaked;
      return dayjs(new BigNumber(userStakedTime).times(1e3).toNumber())
        .add(timelockSeconds, "seconds")
        .format("MMMM Do, YYYY HH:mm:ss");
    },

    maxAmountCanStakeHuman() {
      return new BigNumber(this.stakingInfo.stakingTokenInfo.userBalance)
        .div(new BigNumber(10).pow(this.stakingInfo.stakingTokenInfo.decimals))
        .toFixed();
    },

    rawAmountToStake() {
      return new BigNumber(
        new BigNumber(this.percAmountToStake)
          .div(100)
          .times(this.stakingInfo.stakingTokenInfo.userBalance)
      ).toFixed(0);
    },

    hasStakedTokens() {
      return new BigNumber(this.stakingInfo.userStakingAmount).gt(0);
    },

    formattedAmountToStake() {
      return this.stakingInfo.poolInfo.isStakedNft
        ? this.selectedNftTokenIds.length
        : new BigNumber(
            new BigNumber(this.percAmountToStake)
              .div(100)
              .times(this.stakingInfo.stakingTokenInfo.userBalance)
          )
            .div(
              new BigNumber(10).pow(this.stakingInfo.stakingTokenInfo.decimals)
            )
            .toFormat();
    },

    userStakingBalance() {
      return this.stakingInfo.poolInfo.isStakedNft
        ? this.stakingInfo.stakingTokenInfo.userBalance
        : new BigNumber(this.stakingInfo.stakingTokenInfo.userBalance)
            .div(
              new BigNumber(10).pow(this.stakingInfo.stakingTokenInfo.decimals)
            )
            .toFormat();
    },
  },

  methods: {
    getRewardsTokens(amount) {
      return new BigNumber(amount)
        .div(new BigNumber(10).pow(this.stakingInfo.rewardsTokenInfo.decimals))
        .toFormat();
    },

    isNftSelected(id) {
      return !!this.selectedNftTokenIds.find((i) => i == id);
    },

    toggleNft(id) {
      const index = this.selectedNftTokenIds.findIndex((i) => i == id);
      if (index != -1) return this.selectedNftTokenIds.splice(index, 1);
      this.selectedNftTokenIds.push(id);
      this.selectedNftTokenIds = [...new Set(this.selectedNftTokenIds)];
    },

    async stakeTokens() {
      try {
        if (!this.canStake) return;
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("faasStakeTokens", {
          farmingContractAddress: this.farmAddress,
          stakingContractAddress: this.stakingInfo.stakingTokenInfo.address,
          amountTokens: this.rawAmountToStake,
          nftTokenIds: this.selectedNftTokenIds,
        });
        this.$toast.success(`Successfully staked your tokens!`);
        this.$emit("staked");
        $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        console.error("Error staking tokens", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },

    async unstakeTokens(harvestAsWell = true) {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);

        if (harvestAsWell === false) {
          if (!this.contractIsRemoved) {
            const { isConfirmed } = await this.emergencyUnstake.fire({
              title: "<span class='text-danger'>Emergency Unstake!</span>",
              html: `
                <div>
                  Are you sure you want to emergency unstake your tokens?
                  You <b>WILL NOT</b> receive any unclaimed rewards.
                </div>
              `,
              confirmButtonText: "Yes, unstake WITHOUT rewards!",
              cancelButtonText: "Cancel, do not unstake.",
              showCancelButton: true,
            });
            if (!isConfirmed) return;
          }

          await this.$store.dispatch("faasEmergencyUnstake", {
            farmingContractAddress: this.farmAddress,
          });
        } else {
          await this.$store.dispatch("faasUnstakeTokens", {
            farmingContractAddress: this.farmAddress,
            // amountTokens: this.rawAmountToStake,
          });
        }
        this.$toast.success(`Successfully unstaked all tokens!`);
        this.$emit("staked");
        $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        console.error("Error unstaking tokens", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  mounted() {
    $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
      try {
        this.stakingInfo = await this.$store.dispatch(
          "getFaasStakingInfo",
          this.farmAddress
        );
        if (this.stakingInfo.poolInfo.isStakedNft) {
          this.allUserNftTokens = await this.$store.dispatch(
            "getUserOwnedNfts",
            { tokenAddress: this.stakingInfo.stakingTokenInfo.address }
          );
          // Filter NFT's that do not yet have metadata
          // this.allUserNftTokens = this.allUserNftTokens.filter((nft) => {
          //   const metadata = JSON.parse(nft.metadata);
          //   if (!metadata) return false;
          //   return true;
          // });
        }
      } finally {
        this.isLoadingLocal = false;
      }
    });
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
