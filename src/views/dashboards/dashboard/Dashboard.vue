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
                    i.now-ui-icons.users_single-02
                  h3.info-title
                    animated-number(:value='420')
                  h6.stats-title Holders
            .col-md-2
              .statistics
                .info
                  .icon.icon-success
                    i.now-ui-icons.business_money-coins
                  h3.info-title
                    small $
                    animated-number(:value='5')
                    | M
                  h6.stats-title Total Liquidity
            .col-md-2
              .statistics
                .info
                  .icon.icon-warning
                    i.now-ui-icons.business_chart-bar-32
                  h3.info-title
                    small $
                    animated-number(:value='17')
                    | K
                  h6.stats-title Daily Volume
            .col-md-2
              .statistics
                .info
                  .icon.icon-primary
                    i.now-ui-icons.business_bank
                  h3.info-title
                    animated-number(:value='1')
                    | B
                  h6.stats-title Total Supply
            .col-md-2
              .statistics
                .info
                  .icon.icon-info
                    i.now-ui-icons.education_hat
                  h3.info-title
                    small $
                    animated-number(:value='10')
                    | M
                  h6.stats-title Market Cap
            .col-md-2
              .statistics
                .info
                  .icon.icon-danger
                    i.now-ui-icons.ui-1_lock-circle-open
                  h3.info-title
                    small $
                    animated-number(:value='17')
                    | K
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
import { AnimatedNumber } from "@/components";

export default {
  components: {
    AnimatedNumber,
  },
};
</script>
<style lang="scss" scoped>
a:hover {
  text-decoration: none !important;
}
</style>
