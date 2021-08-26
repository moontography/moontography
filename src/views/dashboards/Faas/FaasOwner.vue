<template lang="pug">
.row
  .col-md-10.mx-auto
    .row.mb-2
      .col-lg-6
        card
          template(v-slot:header='')
            div
              div.d-flex.align-items-center
                h4.card-title.mb-0
                  | Token Users will Stake
                checkbox.ml-3(v-model="isStakableTokenNft") Is the stakable token an NFT?
              div.text-secondary
                small The token users can stake to earn rewards from the rewards pool you've provided.
          token-input-standalone(
            v-model="stakableTokenInfo"
            btn-size="sm"
            btn-text="Find stakable token from contract"
            :is-nft="this.isStakableTokenNft")
      .col-lg-6
        card
          template(v-slot:header='')
            div
              div.d-flex.align-items-center
                h4.card-title.mb-0
                  | Rewards Token
                checkbox.ml-3(
                  v-if="!isStakableTokenNft"
                  v-model="rewardsSameAsStakableToken") Same as token being staked
              div.text-secondary
                small The token you will send the staking contract for users to earn for staking
          token-input-standalone(
            v-model="rewardsTokenInfo"
            ref="rewardsToken"
            btn-size="sm"
            btn-text="Find rewards token from contract")
    .row.mb-2
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
              div.col-8.col-md-4
                div.form-group
                  el-date-picker(
                    :disabled="!(rewardsTokenInfo && rawRewardsSupply)"
                    type="date"
                    placeholder="Approximate pool end date"
                    v-model="poolEndDate"
                    @update:modelValue="setRawPerBlockNum")
              label.col-4.col-md-2.col-form-label
                | Rewards per block:
              div.col-8.col-md-4
                fg-input(
                  :disabled="!(rewardsTokenInfo && rawRewardsSupply)"
                  v-model="perBlockNumFormatted"
                  type="number"
                  placeholder='Tokens rewarded per block')
            
            div.row.mb-4
              label.col-4.col-md-2.col-form-label
                | Staker timelock (in days)
              div.col-8.col-md-10
                fg-input(
                  v-model="userTimelockDays"
                  type="number"
                  placeholder='Minumum number of days user should stake (DEFAULT: 0)')
                    //- template(v-slot:helpblock='')
                    //-   span.form-text
                    //-     | Enter the number of tokens you will send the contract
                    //-     | for users to be rewarded over the lifecycle of the pool.
    
    .row
      .col-md-12.mx-auto
        div.alert.alert-warning(v-if="!isFormValidated")
          b Please fill out all details above to create a new pool for the token(s) you selected!
        div.alert.alert-primary(v-else)
          h3.m-0 Create New Pool!
          div.mt-4
            ol
              li.mb-2
                | Your new pool will require users to stake #[b {{ stakableTokenInfo.symbol }} ({{ stakableTokenInfo.name }})]
                | and will reward users with #[b {{ rewardsTokenInfo.symbol }} ({{ rewardsTokenInfo.name }})]
              li.mb-2
                | Your pool will reward #[b {{ perBlockNumFormatted }} {{ rewardsTokenInfo.symbol }}]
                | per block across all users in the pool until #[b {{ formattedRewardsSupply }} {{ rewardsTokenInfo.symbol }}]
                | have been rewarded in total.
              li.mb-2
                | Your pool rewards will expire approximately on date #[b {{ formatDate(poolEndDate) }}]
              li
                | Your pool will require users to stake their tokens a minimum of
                | #[b {{ userTimelockDays }} days] before they can unstake them.
          div.mt-2
            div.text-center
              n-button(
                type="success"
                size="lg"
                v-loading="globalLoading"
                :disabled="globalLoading"
                @click="createNewPool") Create New Pool
          div.row.mt-2
            div.col-lg-8.mx-auto.text-center
              div You will spend #[b {{ createCost }} MTGY] to create this new pool.
              div It will not cost anything for users to stake their tokens in your pool.
      - // TODO REMOVE
      .col-12(v-if="isScrooge")
        n-button(
          type="danger"
          size="lg"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="removeWegoUpSingle") Remove WEGOUP single sided
        n-button(
          type="danger"
          size="lg"
          v-loading="globalLoading"
          :disabled="globalLoading"
          @click="removeWegoUpLp") Remove WEGOUP Cake-LP
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
      isStakableTokenNft: false,
      rewardsSameAsStakableToken: false,
      rewardsSupply: null,
      poolEndDate: null,
      rawPerBlockNum: 0,
      userTimelockDays: 0,
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
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      createCost: (state) => new BigNumber(state.faas.cost).toFormat(0),
      globalLoading: (state) => state.globalLoading,
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3.instance,
    }),

    isScrooge() {
      return (
        this.userAddy &&
        this.userAddy.toLowerCase() ===
          "0x28D17C78981C3a1e74A76fc04276d3cEb6E0B65A".toLowerCase()
      );
    },

    isFormValidated() {
      return (
        this.stakableTokenInfo &&
        this.stakableTokenInfo.address &&
        this.web3.utils.isAddress(this.stakableTokenInfo.address) &&
        this.rewardsTokenInfo &&
        this.rewardsTokenInfo.address &&
        this.web3.utils.isAddress(this.rewardsTokenInfo.address) &&
        this.rewardsSupply &&
        this.rawPerBlockNum &&
        typeof this.userTimelockSeconds === "number" &&
        this.userTimelockSeconds >= 0
      );
    },

    userTimelockSeconds() {
      if (!this.userTimelockDays || this.userTimelockDays == 0) return 0;
      return new BigNumber(this.userTimelockDays)
        .times(24)
        .times(60)
        .times(60)
        .toNumber();
    },

    formattedRewardsSupply() {
      if (!this.rewardsSupply || this.rewardsSupply == 0) return 0;
      return new BigNumber(this.rewardsSupply).toFormat(0);
    },

    rawRewardsSupply() {
      if (!this.rewardsSupply || this.rewardsSupply == 0) return 0;
      return new BigNumber(this.rewardsSupply)
        .times(new BigNumber(10).pow(this.rewardsTokenInfo.decimals))
        .toFixed(0);
    },

    perBlockNumFormatted: {
      get() {
        if (!(this.rewardsTokenInfo && this.rewardsTokenInfo.decimals))
          return 0;
        return new BigNumber(this.rawPerBlockNum)
          .div(new BigNumber(10).pow(this.rewardsTokenInfo.decimals))
          .toFormat(2);
      },

      set(newPerBlock) {
        if (!this.rewardsTokenInfo) return;
        if (!newPerBlock || newPerBlock == "") return (this.poolEndDate = null);
        this.rawPerBlockNum = new BigNumber(newPerBlock)
          .times(new BigNumber(10).pow(this.rewardsTokenInfo.decimals))
          .toFixed(0);

        if (!this.rawRewardsSupply) return;
        const totalNumBlocksLifetime = new BigNumber(this.rawRewardsSupply).div(
          this.rawPerBlockNum
        );
        const blocksPerSecond = new BigNumber(this.activeNetwork.blocks_per_day)
          .div(24)
          .div(60)
          .div(60);
        this.poolEndDate = dayjs()
          .add(
            totalNumBlocksLifetime.div(blocksPerSecond).toNumber(),
            "seconds"
          )
          .startOf("day")
          .toDate();
      },
    },
  },

  methods: {
    formatDate(d) {
      return dayjs(d).format("YYYY-MM-DD");
    },

    async removeWegoUpSingle() {
      try {
        await this.$store.dispatch(
          "removeStakableTokens",
          "0x982f78bb82ab50ebd975E9B0003b93AD2d62A226"
        );
        this.$toast.success(`Successfully removed all rewards tokens.`);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },

    async removeWegoUpLp() {
      try {
        await this.$store.dispatch(
          "removeStakableTokens",
          "0x7580A314a0727EdfD9309a8A7664975Ab436e583"
        );
        this.$toast.success(`Successfully removed all rewards tokens.`);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },

    setRawPerBlockNum() {
      if (!(this.rewardsTokenInfo && this.rewardsTokenInfo.decimals)) return 0;
      if (!this.rewardsSupply || this.rewardsSupply == 0) return 0;
      if (!this.poolEndDate || dayjs(this.poolEndDate).isBefore(dayjs()))
        return 0;

      const totalBlocks = new BigNumber(
        this.activeNetwork.blocks_per_day
      ).times(dayjs(this.poolEndDate).diff(dayjs(), "days"));
      if (totalBlocks.toNumber() == 0) return 0;

      this.rawPerBlockNum = new BigNumber(this.rawRewardsSupply)
        .div(totalBlocks)
        .toFixed(0);
    },

    async createNewPool() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("faasCreateNewPool", {
          stakableToken: this.stakableTokenInfo.address,
          rewardsToken: this.rewardsTokenInfo.address,
          rewardsSupply: this.rawRewardsSupply,
          perBlockNum: this.rawPerBlockNum,
          timelockSeconds: this.userTimelockSeconds,
          isStakedTokenNft: this.isStakableTokenNft,
        });
        await this.$store.dispatch("getAllStakingContracts");
        this.$router.push("/faas");
      } catch (err) {
        console.error("Error creating pool", err);
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  async created() {
    await this.$store.dispatch("getFaasPoolCreationCost");
  },
};
</script>
