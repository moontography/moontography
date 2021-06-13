<template lang="pug">
div
  .row
    .col-md-12
      .card.card-stats.card-raised
        .card-body
          .row
            .col-md-2
              .statistics
                .info
                  .icon.icon-info
                    i.fa.fa-users 
                  h3.info-title
                    animated-number(:value='(tokenInfo.community_data.twitter_followers || 0) + (tokenInfo.community_data.reddit_subscribers || 0) + (tokenInfo.community_data.telegram_channel_user_count || 0)')
                  h6.stats-title Community
            //- .col-md-2
            //-   .statistics
            //-     .info
            //-       .icon.icon-info
            //-         i.now-ui-icons.users_single-02
            //-       h3.info-title
            //-         animated-number(:value='420')
            //-       h6.stats-title Holders
            .col-md-2
              .statistics
                .info
                  .icon.icon-success
                    i.now-ui-icons.business_money-coins
                  h3.info-title
                    small $
                    animated-number(:value='tokenInfo.market_data.fully_diluted_valuation.usd')
                  h6.stats-title Valuation
            .col-md-2
              .statistics
                .info
                  .icon.icon-warning
                    i.now-ui-icons.business_chart-bar-32
                  h3.info-title
                    small $
                    animated-number(:value='tokenInfo.market_data.total_volume.usd')
                  h6.stats-title Total Volume
            .col-md-2
              .statistics
                .info
                  .icon.icon-primary
                    i.now-ui-icons.business_bank
                  h3.info-title
                    small $
                    animated-number(:value='tokenInfo.market_data.circulating_supply')
                  h6.stats-title Circulating Supply
            .col-md-2
              .statistics
                .info
                  .icon.icon-info
                    i.now-ui-icons.education_hat
                  h3.info-title
                    small $
                    animated-number(:value='tokenInfo.market_data.market_cap.usd')
                  h6.stats-title Market Cap
            .col-md-2
              .statistics
                .info
                  .icon.icon-danger
                    i.now-ui-icons.ui-1_lock-circle-open
                  h3.info-title
                    small $
                    animated-number(:value='tokenInfo.market_data.total_value_locked')
                  h6.stats-title Total Value Locked
  .row    
    .col-lg-3
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
    
    .col-lg-3
      card
        .card-body.text-center
          a(href="#/timestamping")
            .statistics
              .info
                .icon.icon-success
                  i.now-ui-icons.sport_trophy
                h3.info-title
                  | Farming as a Service
                h6.stats-title.text-success Live Now!

    .col-lg-3
      card
        .card-body.text-center
          a(href="#/timestamping")
            .statistics
              .info
                .icon.icon-warning
                  i.now-ui-icons.objects_spaceship
                h3.info-title
                  | Bulk Token Sender
                h6.stats-title.text-warning Coming Soon..
    
    .col-lg-3
      card
        .card-body.text-center
          a(href="#/timestamping")
            .statistics
              .info
                .icon.icon-warning
                  i.now-ui-icons.business_money-coins
                h3.info-title
                  | Decentralized Tax Reporting
                h6.stats-title.text-warning Coming Soon..
            
</template>
<script>
import { mapState } from "vuex";
import { AnimatedNumber } from "@/components";

export default {
  components: {
    AnimatedNumber,
  },

  computed: {
    ...mapState({
      tokenInfo: (state) => state.mtgyInfo,
    }),
  },
};
</script>
<style lang="scss" scoped></style>
