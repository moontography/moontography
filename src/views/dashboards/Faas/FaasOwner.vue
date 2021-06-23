<template lang="pug">
.row
  .col-md-10.mx-auto
    .row.mb-2
      .col-lg-6
        card
          template(v-slot:header='')
            div
              h4.card-title.mb-0
                | Stakable Token
              div.text-secondary
                small The token users can stake to earn rewards from the rewards pool you've provided.
          token-input-standalone(
            v-model="stakableTokenInfo"
            btn-size="sm"
            btn-text="Find stakable token from contract")
      .col-lg-6
        card
          template(v-slot:header='')
            div
              div.d-flex.align-items-center
                h4.card-title.mb-0
                  | Rewards Token
                checkbox.ml-3(v-model="rewardsSameAsStakableToken") Same as stakable token
              div.text-secondary
                small The token you will send the staking contract for users to earn for staking
          token-input-standalone(
            v-model="rewardsTokenInfo"
            ref="rewardsToken"
            btn-size="sm"
            btn-text="Find rewards token from contract")
    .row
      .col-md-12.mx-auto
        card
          template(v-slot:header='')
            h4.card-title
              | Pool Information
          form.form-horizontal
            div.row.mb-4
              label.col-4.col-md-2.col-form-label
                | Rewards Supply (# tokens)
              div.col-8.col-md-10
                fg-input(
                  v-model="rewardsSupply"
                  type="number"
                  placeholder='Rewards Supply (# tokens)')
                    //- template(v-slot:helpblock='')
                    //-   span.form-text
                    //-     | Enter the number of tokens you will send the contract
                    //-     | for users to be rewarded over the lifecycle of the pool.

            div.row.mb-4
              label.col-4.col-md-2.col-form-label
                | When should pool expire?
              div.col-4.col-md-8
                div.form-group
                  el-date-picker(
                    type="date"
                    placeholder="Approximate pool end date"
                    v-model="poolEndDate")
              div.col-4.col-md-2.col-form-label Per block rewards: {{ perBlockNum }}
            
            div.row.mb-4
              label.col-4.col-md-2.col-form-label
                | Staker timelock (in days)
              div.col-8.col-md-10
                fg-input(
                  type="number"
                  placeholder='Minumum number of days user should stake (DEFAULT: 0)')
                    //- template(v-slot:helpblock='')
                    //-   span.form-text
                    //-     | Enter the number of tokens you will send the contract
                    //-     | for users to be rewarded over the lifecycle of the pool.

</template>

<script>
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  props: {
    tokenAddress: { type: String, default: null },
  },

  data() {
    return {
      activeTab: "Profile",
      stakableTokenInfo: null,
      rewardsTokenInfo: null,
      rewardsSameAsStakableToken: false,
      rewardsSupply: null,
      poolEndDate: null,
    };
  },

  watch: {
    rewardsSameAsStakableToken(isSame) {
      if (isSame) {
        this.rewardsTokenInfo = this.stakableTokenInfo;
      } else {
        this.rewardsTokenInfo = null;
      }
    },
  },

  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork,
    }),

    rewardsSupplyIncludeDecimals() {
      if (!this.rewardsSupply || this.rewardsSupply == 0) return 0;
      return new BigNumber(this.rewardsSupply).times(
        new BigNumber(10).pow(this.rewardsTokenInfo.decimals)
      );
    },

    perBlockNum() {
      if (!(this.rewardsTokenInfo && this.rewardsTokenInfo.decimals)) return 0;
      if (!this.rewardsSupply || this.rewardsSupply == 0) return 0;
      if (!this.poolEndDate || dayjs(this.poolEndDate).isBefore(dayjs()))
        return 0;

      const totalBlocks = new BigNumber(
        this.activeNetwork.blocks_per_day
      ).times(dayjs(this.poolEndDate).diff(dayjs(), "days"));
      if (totalBlocks.toNumber() == 0) return 0;

      const rawTokensPerBlock = new BigNumber(
        this.rewardsSupplyIncludeDecimals
      ).div(totalBlocks);
      return new BigNumber(rawTokensPerBlock)
        .div(new BigNumber(10).pow(this.rewardsTokenInfo.decimals))
        .toFormat(2);
    },
  },
};
</script>
