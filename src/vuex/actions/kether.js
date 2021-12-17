import BigNumber from "bignumber.js";
import exponentialBackoff from "../../factories/ExponentialBackoff";
import KetherHomepage from "../../factories/web3/KetherHomepage";
import KetherNFT from "../../factories/web3/KetherNFT";
import KetherNFTLoaner from "../../factories/web3/KetherNFTLoaner";

export default {
  async getAllKetherPlots({ commit, dispatch, getters, state }, reset = false) {
    if (state.kether.plotInfo && state.kether.plotInfo.length > 0 && !reset)
      return;

    const web3 = state.web3.instance;
    const ketherContract = getters.activeNetwork.contracts.kether;
    const contract = KetherHomepage(web3, ketherContract);
    const numberPlots = await contract.methods.getAdsLength().call();
    const plotInfo = await Promise.all(
      new Array(parseInt(numberPlots)).fill(0).map(async (_, plotIndex) => {
        return await exponentialBackoff(
          async () => await dispatch("getKetherPlot", plotIndex)
        );
      })
    );
    const plotInfoAggData = plotInfo.reduce(
      (obj, plot) => {
        const whKey = `${plot.width * 10}x${plot.height * 10}px`;
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
      },
      {
        widthHeight: {},
        area: {},
      }
    );

    commit("SET_KETHER_PLOT_INFO", plotInfo);
    commit("SET_KETHER_PLOT_AGG_DATA_INFO", plotInfoAggData);
  },

  async getKetherPlot({ getters, state }, plotIndex) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherContract = getters.activeNetwork.contracts.kether;
    const ketherNFTCont = getters.activeNetwork.contracts.ketherNFT;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const contract = KetherHomepage(web3, ketherContract);
    const nftContract = ketherNFTCont && KetherNFT(web3, ketherNFTCont);
    const loanerContract =
      ketherNFTLoanerCont && KetherNFTLoaner(web3, ketherNFTLoanerCont);
    let [theAd, precomputeInfo] = await Promise.all([
      contract.methods.ads(plotIndex).call(),
      (async function getPrecompute() {
        if (nftContract) {
          return await nftContract.methods
            .precompute(plotIndex, userAddy)
            .call();
        }
      })(),
    ]);
    theAd.actualOwner = theAd.owner;
    if (
      precomputeInfo &&
      theAd.owner.toLowerCase() === precomputeInfo[1].toLowerCase()
    ) {
      theAd.actualOwner = userAddy;
    } else if (theAd.owner.toLowerCase() === ketherNFTCont.toLowerCase()) {
      theAd.isWrapped = true;
      const adOwner = await nftContract.methods.ownerOf(plotIndex).call();
      if (adOwner.toLowerCase() === ketherNFTLoanerCont.toLowerCase()) {
        const ownerObj = await loanerContract.methods.owners(plotIndex).call();
        theAd.isLoanable = true;
        theAd.actualOwner = ownerObj.owner;
        const [hasActiveLoan, loanInfo] = await Promise.all([
          loanerContract.methods.hasActiveLoan(plotIndex).call(),
          loanerContract.methods.loans(plotIndex).call(),
        ]);
        theAd.hasActiveLoan = hasActiveLoan;
        theAd.loanInfo = loanInfo;
      } else {
        theAd.actualOwner = adOwner;
      }
    }
    return { ...theAd, index: plotIndex };
  },

  async wrapKetherPlot({ getters, state }, plotIndex) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherContract = getters.activeNetwork.contracts.kether;
    const ketherNFTCont = getters.activeNetwork.contracts.ketherNFT;
    const contract = KetherHomepage(web3, ketherContract);
    const nftContract = KetherNFT(web3, ketherNFTCont);
    const [precomputeInfo, vanillaAd] = await Promise.all([
      nftContract.methods.precompute(plotIndex, userAddy).call(),
      contract.methods.ads(plotIndex).call(),
    ]);
    const wrap = async () =>
      await nftContract.methods
        .wrap(plotIndex, userAddy)
        .send({ from: userAddy });
    const precomputedAddy = precomputeInfo[1];
    // If the current owner is the user, we need to wrap it
    if (vanillaAd.owner.toLowerCase() === userAddy.toLowerCase()) {
      await contract.methods
        .setAdOwner(plotIndex, precomputedAddy)
        .send({ from: userAddy });
      await wrap();
    } else if (
      vanillaAd.owner.toLowerCase() === precomputedAddy.toLowerCase()
    ) {
      await wrap();
    }
  },

  async unwrapKetherPlot({ getters, state }, plotIndex) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherNFTCont = getters.activeNetwork.contracts.ketherNFT;
    const nftContract = KetherNFT(web3, ketherNFTCont);
    await nftContract.methods
      .unwrap(plotIndex, userAddy)
      .send({ from: userAddy });
  },

  async getAddPlotToMakeLoanableCharge({ getters, state }) {
    const web3 = state.web3.instance;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    return await loanerContract.methods.loanServiceCharge().call();
  },

  async getLoanPlotPerDayCharge({ getters, state }, plotIndex) {
    const web3 = state.web3.instance;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    const [plotInfo, defaultLoanCharge] = await Promise.all([
      loanerContract.methods.owners(plotIndex).call(),
      loanerContract.methods.loanChargePerDay().call(),
    ]);
    const plotChargeOverride = plotInfo.overrideLoanChargePerDay;
    return plotChargeOverride > 0 ? plotChargeOverride : defaultLoanCharge;
  },

  async getPerLoanServicePercentage({ getters, state }) {
    const web3 = state.web3.instance;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    return await loanerContract.methods.loanPercentageCharge().call();
  },

  async makeKetherPlotLoanable(
    { dispatch, getters, state },
    { index: plotIndex, overridePerDayCharge, overrideMaxDays }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherNFTCont = getters.activeNetwork.contracts.ketherNFT;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    // const nftContract = KetherNFT(web3, ketherNFTCont);
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    const loanCharge = await dispatch(
      "getAddPlotToMakeLoanableCharge",
      plotIndex
    );
    await dispatch("genericErc721Approval", {
      tokenAddress: ketherNFTCont,
      delegateAddress: ketherNFTLoanerCont,
    });
    await loanerContract.methods
      .addPlot(plotIndex, overridePerDayCharge, overrideMaxDays)
      .send({ from: userAddy, value: loanCharge });
  },

  async removeKetherPlotFromLoanable({ getters, state }, plotIndex) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    const hasLoan = await loanerContract.methods
      .hasActiveLoan(plotIndex)
      .call();
    let amountToSend = 0;
    if (hasLoan) {
      const loanInfo = await loanerContract.methods.loans(plotIndex).call();
      amountToSend = loanInfo.totalFee;
    }
    await loanerContract.methods
      .removePlot(plotIndex)
      .send({ from: userAddy, value: amountToSend });
  },

  async loanPlot(
    { dispatch, getters, state },
    { index, numDays, publishInfo }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    const [hasLoan, perDayCharge] = await Promise.all([
      loanerContract.methods.hasActiveLoan(index).call(),
      dispatch("getLoanPlotPerDayCharge", index),
    ]);
    if (hasLoan) throw new Error(`This plot is already being loaned.`);

    const value = new BigNumber(perDayCharge).times(numDays).toFixed();
    await loanerContract.methods
      .loanPlot(index, numDays, publishInfo)
      .send({ from: userAddy, value });
  },

  async publishPlot({ getters, state }, { index, publishInfo }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const ketherNFTCont = getters.activeNetwork.contracts.ketherNFT;
    const ketherNFTLoanerCont = getters.activeNetwork.contracts.ketherNFTLoaner;
    const nftContract = KetherNFT(web3, ketherNFTCont);
    const loanerContract = KetherNFTLoaner(web3, ketherNFTLoanerCont);
    const hasLoan = await loanerContract.methods.hasActiveLoan(index).call();
    console.log("LOAN", hasLoan, index, publishInfo);
    if (hasLoan) {
      await loanerContract.methods
        .publish(index, publishInfo)
        .send({ from: userAddy });
    } else {
      const [link, image, title, NSFW] = publishInfo;
      await nftContract.methods
        .publish(index, link, image, title, NSFW)
        .send({ from: userAddy });
    }
  },
};
