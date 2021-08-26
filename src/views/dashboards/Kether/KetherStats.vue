<template lang="pug">
.row
  .col-md-12.mx-auto
    div.row
      div.col-xl-10.mx-auto
        div(v-if="isLoadingLocal")
          loading-panel
        div(v-else)
          card.b-4
            template(v-slot:header='')
              h4.card-title
                | Your Plots
            div(v-if="yourPlots.length === 0")
              i You don't have any plots yet!
            div.table-responsive(v-else)
              n-table.mb-0(
                :columns="yourPlotColumns"
                :data='yourPlots')
                  template(v-slot:columns)
                  template(v-slot:default='row')
                    td {{ row.item.index }}
                    td {{ row.item.x }}
                    td {{ row.item.y }}
                    td {{ row.item.width * 10 }}px
                    td {{ row.item.height * 10 }}px
                    td {{ row.item.title || 'N/A' }}
                    td {{ row.item.link || 'N/A' }}
                    td {{ row.item.image || 'N/A' }}
          card
            template(v-slot:header='')
              h4.card-title
                | Overall Plot Stats (#[strong {{ plotInfo.length }}] total)
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
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import KetherHomepage from "../../../factories/web3/KetherHomepage";

export default {
  data() {
    return {
      isLoadingLocal: false,
      ketherContract: null,
      plotInfo: [],
      plotInfoAggData: {
        widthHeight: {},
        area: {},
      },
    };
  },

  computed: {
    ...mapState({
      userAddy: (state) => state.web3.address,
      web3: (state) => state.web3 && state.web3.instance,
    }),

    areaAggColumns() {
      return [{ text: "Area" }, { text: "Number Plots" }];
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
      return [{ text: "Width/Height" }, { text: "Number Plots" }];
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

    yourPlotColumns() {
      return [
        { text: "Index" },
        { text: "x" },
        { text: "y" },
        { text: "Width" },
        { text: "Height" },
        { text: "Title" },
        { text: "Link" },
        { text: "Image" },
      ];
    },

    yourPlots() {
      return this.plotInfo
        .map((plot, index) => {
          return { ...plot, index };
        })
        .filter(
          (plot) => plot.owner.toLowerCase() === this.userAddy.toLowerCase()
        );
    },
  },

  methods: {
    async getPlots() {
      try {
        this.isLoadingLocal = true;
        const numberPlots = await this.ketherContract.methods
          .getAdsLength()
          .call();
        this.plotInfo = await Promise.all(
          new Array(parseInt(numberPlots)).fill(0).map(async (_, plotIndex) => {
            return await this.ketherContract.methods.ads(plotIndex).call();
          })
        );
        this.plotInfoAggData = this.plotInfo.reduce((obj, plot) => {
          const whKey = `w${plot.width * 10}:h${plot.height * 10}`;
          obj.widthHeight[whKey] = obj.widthHeight[whKey] || [];
          obj.widthHeight = {
            ...obj.widthHeight,
            [whKey]: obj.widthHeight[whKey].concat(plot),
          };

          const areaKey = new BigNumber(plot.width)
            .times(10)
            .times(plot.height)
            .times(10)
            .toFixed();
          obj.area[areaKey] = obj.area[areaKey] || [];
          obj.area = {
            ...obj.area,
            [areaKey]: obj.area[areaKey].concat(plot),
          };

          return obj;
        }, this.plotInfoAggData);
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.isLoadingLocal = false;
      }
    },
  },

  async mounted() {
    this.ketherContract = KetherHomepage(this.web3);
    await this.getPlots();
  },
};
</script>
