<template lang="pug">
div.row.d-flex.justify-content-center
  div.text-center
    h3.title Roadmap
  div.col-md-12
    time-line
      time-line-item(
        inverted
        badge-type="danger"
        badge-icon="now-ui-icons sport_trophy")
      
        template(v-slot:header)
          span.badge.badge-danger Farming as a Service

        template(v-slot:content)
          p Provide farming for any contract address.

        template(v-slot:footer)
          h6
            i.ti-time Coming Soon

      time-line-item(
        badge-type="success" 
        badge-icon="now-ui-icons objects_spaceship")
      
        template(v-slot:header)
          span.badge.badge-success Bulk Token Sender

        template(v-slot:content)
          p Bulk send tokens from any contract address to a CSV list of wallet addresses.

        template(v-slot:footer)
          h6
            i.ti-time Coming Soon

      time-line-item(
        inverted
        badge-type="info"
        badge-icon="now-ui-icons business_money-coins"
      )
        template(v-slot:header)
          span.badge.badge-info Decentralized Tax Reporting (DTAX)

        template(v-slot:content)
          div
            p Provide tax documentation for all trasacions from a given wallet address.
          
        template(v-slot:footer)
          h6
            i.ti-time Coming Soon
</template>
<script>
import TimeLine from "../../../components/Timeline/Timeline";
import TimeLineItem from "../../../components/Timeline/TimelineItem";

export default {
  components: {
    TimeLine,
    TimeLineItem,
  },
};
</script>
<style></style>
