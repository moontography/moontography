<template lang="pug">
.row
  .col-md-12(v-if="localError")
    div.alert.alert-danger(v-if="localError")
      | {{ localError.message }}
  .col-md-12.mx-auto(v-else)
    div(v-if="isLoadingLocal")
      loading-panel
    div.row(v-else)
      div.col-xl-7
        kether-user-plots-card
      div.col-xl-5.mx-auto
        card
          template(v-slot:header='')
            h4.card-title
              | Overall Plot Stats (#[strong {{ plotInfo.length }}] total,
              | #[strong {{ numberUniqueOwners }}] owners)
          div.row
            div.col-lg-6
              n-table.mb-0(
                :columns="widthHeightAggColumns"
                :data='widthHeightAggArray')
                  template(v-slot:columns)
                  template(v-slot:default='row')
                    td {{ row.item }}
                    td {{ plotInfoAggData.widthHeight[row.item].length }}
            div.col-lg-6
              n-table.mb-0(
                :columns="areaAggColumns"
                :data='areaAggArray')
                  template(v-slot:columns)
                  template(v-slot:default='row')
                    td {{ row.item }}px
                    td {{ plotInfoAggData.area[row.item].length }}
</template>
<script>
import { mapState } from "vuex";
import KetherUserPlotsCard from "./KetherUserPlotsCard";

export default {
  components: {
    KetherUserPlotsCard,
  },

  data() {
    return {
      isLoadingLocal: false,
      localError: null,
      ketherContract: null,
    };
  },

  watch: {
    ketherContractAddress(newAddy) {
      if (!newAddy) {
        return (this.localError = new Error(
          `The connected network does not support 1000 Ether Homepage!`
        ));
      }
    },
  },

  computed: {
    ...mapState({
      ketherContractAddress: (_, getters) =>
        getters.activeNetwork && getters.activeNetwork.contracts.kether,
      plotInfo: (state) => state.kether.plotInfo,
      plotInfoAggData: (state) => state.kether.plotInfoAggregateData,
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3 && state.web3.instance,
    }),

    numberUniqueOwners() {
      return Object.keys(
        this.plotInfo.reduce((obj, plot) => {
          return { ...obj, [plot.owner]: true };
        }, {})
      ).length;
    },

    areaAggColumns() {
      return [{ text: "Area" }, { text: "Plots" }];
    },

    areaAggArray() {
      return Object.keys(this.plotInfoAggData.area).sort((a1, a2) => {
        return this.plotInfoAggData.area[a1].length >
          this.plotInfoAggData.area[a2].length
          ? -1
          : 1;
      });
    },

    widthHeightAggColumns() {
      return [{ text: "Width/Height" }, { text: "Plots" }];
    },

    widthHeightAggArray() {
      return Object.keys(this.plotInfoAggData.widthHeight).sort((wh1, wh2) => {
        // const whRegexp = /w(\d+):h(\d+)/;
        // const w1 = wh1.replace(whRegexp, "$1");
        // const h1 = wh1.replace(whRegexp, "$1");
        // const w2 = wh2.replace(whRegexp, "$1");
        // const h2 = wh2.replace(whRegexp, "$1");
        // const w2Bigger = new BigNumber(w2).gt(w1);
        // const h2Bigger = new BigNumber(h2).gt(h1);
        // return w2Bigger || h2Bigger ? 1 : -1;
        return this.plotInfoAggData.widthHeight[wh1].length >
          this.plotInfoAggData.widthHeight[wh2].length
          ? -1
          : 1;
      });
    },
  },

  methods: {
    async getPlots(reset = false) {
      try {
        this.isLoadingLocal = true;
        await this.$store.dispatch("getAllKetherPlots", reset);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.isLoadingLocal = false;
      }
    },
  },

  async mounted() {
    if (!this.ketherContractAddress) {
      return (this.localError = new Error(
        `The connected network does not support 1000 Ether Homepage!`
      ));
    } else {
      await this.getPlots();
    }
  },
};
</script>
