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
            | Add/Remove to your Staked Tokens
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="this.isLoadingLocal")
          div.text-center(v-else)
            div
              div.card-category
                | Farm contract:
                | {{ farmAddress }}
              div You will stake:
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
              div(v-if="!isExpired")
                | You can stake up to #[strong {{ userStakingBalance }}]
                | {{ stakingInfo.stakingTokenInfo.symbol }}
              div.row(v-if="!isExpired")
                div.col-9
                  slider(v-model="percAmountToStake")
                div.col-3
                  fg-input(
                    addon-right-icon="fa fa-percent"
                    v-model="percAmountToStake")
              //- div {{ formattedAmountToStake }}
              div
                n-button(
                  v-if="!isExpired"
                  type="success"
                  size="lg"
                  v-loading="globalLoading"
                  :disabled="globalLoading"
                  @click="stakeTokens") Stake {{ formattedAmountToStake }} {{ stakingInfo.stakingTokenInfo.symbol }}
              template(v-if="hasStakedTokens")
                div.text-danger.mt-4(v-if="!isPastTimelock")
                  b
                    | This farm has a {{ timelockDays }} day timelock. You originally staked at {{ timeUserOriginallyStaked }}
                    | and will be able to unstake your tokens after {{ timeUserCanUnstake }}.
                div.d-flex.align-items-center.mt-4(v-else)
                  a.clickable.text-danger(
                    v-loading="globalLoading"
                    @click="unstakeTokens()") Unstake Tokens Currently Staked
                  //- n-button.mt-4(
                  //-   type="danger"
                  //-   size="sm"
                  //-   v-loading="globalLoading"
                  //-   :disabled="globalLoading"
                  //-   @click="unstakeTokens") Unstake Tokens Currently Staked
                  div.ml-auto
                    a.text-danger.clickable(
                      v-loading="globalLoading"
                      @click="unstakeTokens(false)")
                        i.fa.fa-exclamation-triangle
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
      globalLoading: (state) => state.globalLoading,
    }),

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

      return false;
    },

    timelockDays() {
      const timelockSeconds = this.stakingInfo.poolInfo.stakeTimeLockSec;
      if (!timelockSeconds) return 0;
      return new BigNumber(timelockSeconds).div(60).div(60).div(24).toFormat();
    },

    timeUserOriginallyStaked() {
      const userStakedTime = this.stakingInfo.stakerInfo.timeOriginallyStaked;
      return dayjs(new BigNumber(userStakedTime).times(1e3).toNumber()).format(
        "MMMM Do, YYYY hh:mm:ss"
      );
    },

    timeUserCanUnstake() {
      const timelockSeconds = this.stakingInfo.poolInfo.stakeTimeLockSec;
      const userStakedTime = this.stakingInfo.stakerInfo.timeOriginallyStaked;
      return dayjs(new BigNumber(userStakedTime).times(1e3).toNumber())
        .add(timelockSeconds, "seconds")
        .format("MMMM Do, YYYY hh:mm:ss");
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
      return new BigNumber(
        new BigNumber(this.percAmountToStake)
          .div(100)
          .times(this.stakingInfo.stakingTokenInfo.userBalance)
      )
        .div(new BigNumber(10).pow(this.stakingInfo.stakingTokenInfo.decimals))
        .toFormat();
    },

    userStakingBalance() {
      return new BigNumber(this.stakingInfo.stakingTokenInfo.userBalance)
        .div(new BigNumber(10).pow(this.stakingInfo.stakingTokenInfo.decimals))
        .toFormat();
    },
  },

  methods: {
    getRewardsTokens(amount) {
      return new BigNumber(amount)
        .div(new BigNumber(10).pow(this.stakingInfo.rewardsTokenInfo.decimals))
        .toFormat();
    },

    async stakeTokens() {
      try {
        if (this.rawAmountToStake <= 0) return;
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("faasStakeTokens", {
          farmingContractAddress: this.farmAddress,
          stakingContractAddress: this.stakingInfo.stakingTokenInfo.address,
          amountTokens: this.rawAmountToStake,
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
          const { isConfirmed } = await this.emergencyUnstake.fire({
            title: "<span class='text-danger'>Emergency Unstake!</span>",
            html: `
          <div>
            Are you sure you want to emergency unstake your tokens?
            You <b>WILL NOT</b> receive any unclaimed rewards.
          </div>
        `,
            confirmButtonText: "Yes, I want to unstake without rewards!",
            cancelButtonText: "Cancel, do not unstake.",
            showCancelButton: true,
          });
          if (!isConfirmed) return;
        }

        await this.$store.dispatch("faasUnstakeTokens", {
          farmingContractAddress: this.farmAddress,
          // amountTokens: this.rawAmountToStake,
          harvestTokens: harvestAsWell,
        });
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

  async mounted() {
    $(`#${this.$el.id}`).on("shown.bs.modal", async () => {
      try {
        this.stakingInfo = await this.$store.dispatch(
          "getFaasStakingInfo",
          this.farmAddress
        );
      } finally {
        this.isLoadingLocal = false;
      }
    });
  },
};
</script>
