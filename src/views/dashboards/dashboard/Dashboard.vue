<template lang="pug">
div
  .row
    .col-md-12
      .card.card-stats.card-raised
        .card-body
          .row
            //- .col-md
            //-   .statistics
            //-     .info
            //-       .icon.icon-info
            //-         i.fa.fa-users 
            //-       h3.info-title
            //-         animated-number(:value='communityTotal')
            //-       h6.stats-title Community
            //- .col-md
            //-   .statistics
            //-     .info
            //-       .icon.icon-info
            //-         i.now-ui-icons.users_single-02
            //-       h3.info-title
            //-         animated-number(:value='0')
            //-       h6.stats-title Holders
            .col-md
              .statistics
                .info
                  .icon.icon-primary
                    i.now-ui-icons.business_bank
                  h3.info-title
                    //- small $
                    animated-number(:value='circSupply')
                  h6.stats-title Circulating Supply
            .col-md
              .statistics
                .info
                  .icon.icon-info
                    i.now-ui-icons.education_hat
                  h3.info-title
                    small $
                    animated-number(:value='marketCap')
                  h6.stats-title Market Cap
            .col-md
              .statistics
                .info
                  .icon.icon-success
                    i.now-ui-icons.business_money-coins
                  h3.info-title
                    small $
                    animated-number(:value='fdMarketCap')
                  h6.stats-title Fully Diluted MC
            .col-md
              .statistics
                .info
                  .icon.icon-warning
                    i.now-ui-icons.business_chart-bar-32
                  h3.info-title
                    small $
                    animated-number(:value='totalVolume')
                  h6.stats-title Daily Volume
            .col-md
              .statistics
                .info
                  .icon.icon-danger
                    i.now-ui-icons.ui-1_lock-circle-open
                  h3.info-title
                    small $
                    animated-number(:value='tvl')
                  h6.stats-title Total Value Locked
  .row    
    .col-lg-4
      card
        .card-body.text-center
          a(href="#/timestamping")
            .statistics
              .info
                .icon.icon-success
                  i.now-ui-icons.design_app
                h3.info-title
                  | Trusted Timestamping
                h6.stats-title.text-success Live Now!
    
    .col-lg-4
      card
        .card-body.text-center
          a(href="#/faas")
            .statistics
              .info
                .icon.icon-success
                  i.now-ui-icons.sport_trophy
                h3.info-title
                  | Farming as a Service
                h6.stats-title.text-success Live Now!

    .col-lg-4
      card
        .card-body.text-center
          a(href="#/passwords")
            .statistics
              .info
                .icon.icon-success
                  i.now-ui-icons.objects_spaceship
                h3.info-title
                  | Password Manager
                h6.stats-title.text-success Live Now!
    
    .col-lg-4
      card
        .card-body.text-center
          a(href="#/bts")
            .statistics
              .info
                .icon.icon-warning
                  i.now-ui-icons.business_money-coins
                h3.info-title
                  | Bulk Token Sender
                h6.stats-title.text-warning Coming Soon..
    
    .col-lg-4
      card
        .card-body.text-center
          a(href="#/paas")
            .statistics
              .info
                .icon.icon-danger
                  i.now-ui-icons.business_money-coins
                h3.info-title
                  | Polling as a Service
                h6.stats-title.text-danger Coming Soon..

    .col-lg-4
      card
        .card-body.text-center
          a(href="#/dtax")
            .statistics
              .info
                .icon.icon-info
                  i.now-ui-icons.business_money-coins
                h3.info-title
                  | Decentralized Tax Reporting
                h6.stats-title.text-info Coming Soon..
            
</template>
<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import { AnimatedNumber } from "@/components";

export default {
  components: {
    AnimatedNumber,
  },

  computed: {
    ...mapState({
      circSupply: (state) => state.mtgyCircSupply,
      mtgyPriceUsd: (state) => state.mtgyPriceUsd,
      tokenInfo: (state) => state.mtgyTokenInfo,
    }),

    // circSupply() {
    //   return this.tokenInfo.market_data.circulating_supply;
    // },

    marketCap() {
      return new BigNumber(this.circSupply).times(this.mtgyPriceUsd).toFixed(2);
    },

    fdMarketCap() {
      return this.tokenInfo.market_data.fully_diluted_valuation.usd;
    },

    totalVolume() {
      return this.tokenInfo.market_data.total_volume.usd;
    },

    communityTotal() {
      return (
        (this.tokenInfo.community_data.twitter_followers || 0) +
        (this.tokenInfo.community_data.reddit_subscribers || 0) +
        (this.tokenInfo.community_data.telegram_channel_user_count || 0)
      );
    },

    tvl() {
      return this.tokenInfo.market_data.total_value_locked;
    },
  },
};
</script>
<style lang="scss" scoped>
a:hover {
  text-decoration: none !important;
}
</style>
