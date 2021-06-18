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
          h3.modal-title.d-flex.align-items-center #[i.now-ui-icons.users_circle-08.mr-2] Add/Remove to your Staked Tokens
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          loading-panel(v-if="this.isLoadingLocal")
          div.text-center(v-else)
            div You will stake:
            h1.card-title {{ stakingInfo.stakingTokenInfo.symbol }}
            h3.card-category {{ stakingInfo.stakingTokenInfo.name }}
            p.card-description
              | You and any other stakers will be rewarded #[strong {{ getRewardsTokens(stakingInfo.tokensRewardedPerBlock) }}]
              | {{ stakingInfo.rewardsTokenInfo.symbol }} per block in aggregate.
            hr
            div.card-footer
              div
                | Your can stake up to #[strong {{ userStakingBalance }}]
                | {{ stakingInfo.stakingTokenInfo.symbol }}
              div.row
                div.col-9
                  slider(v-model="percAmountToStake")
                div.col-3
                  fg-input(
                    addon-right-icon="fa fa-percent"
                    v-model="percAmountToStake")
              //- div {{ formattedAmountToStake }}
              n-button(
                type="success"
                size="lg"
                v-loading="globalLoading"
                :disabled="globalLoading"
                @click="stakeTokens") Stake {{ formattedAmountToStake }} {{ stakingInfo.stakingTokenInfo.symbol }}
              n-button.ml-2(
                type="danger"
                size="lg"
                v-loading="globalLoading"
                :disabled="globalLoading"
                @click="unstakeTokens") Unstake All Tokens
</template>

<script>
import $ from "jquery";
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
export default {
  name: "AddRemoveStakeModal",

  props: {
    farmAddress: { type: String, default: null },
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
    };
  },

  computed: {
    ...mapState({
      // cost: (state) => state.passwordManager.cost,
      globalLoading: (state) => state.globalLoading,
    }),

    rawAmountToStake() {
      return new BigNumber(
        new BigNumber(this.percAmountToStake)
          .div(100)
          .times(this.stakingInfo.stakingTokenInfo.userBalance)
      ).toFixed(0);
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
  },

  async unstakeTokens() {
    try {
      this.$store.commit("SET_GLOBAL_LOADING", true);
      // await this.$store.dispatch("faasStakeTokens", {
      //   farmingContractAddress: this.farmAddress,
      //   stakingContractAddress: this.stakingInfo.stakingTokenInfo.address,
      //   amountTokens: this.rawAmountToStake,
      // });
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

  async created() {
    try {
      this.stakingInfo = await this.$store.dispatch(
        "getFaasStakingInfo",
        this.farmAddress
      );
    } finally {
      this.isLoadingLocal = false;
    }
  },
};
</script>
