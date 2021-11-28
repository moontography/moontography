import BigNumber from "bignumber.js";
// import MTGY from "../../factories/web3/MTGY";
import ERC20 from "@/factories/web3/ERC20";
import MTGYOKLGSwap from "../../factories/web3/MTGYOKLGSwap";

export default {
  async getMtgyOklgRatio({ commit, getters, state }) {
    const web3 = state.web3.instance;
    // const userAddy = state.web3.address;
    const mtgyOklgSwapAddy = getters.activeNetwork.contracts.mtgyOklgSwap;
    const contract = MTGYOKLGSwap(web3, mtgyOklgSwapAddy);
    const [mtgyOklgRatio] = await Promise.all([
      contract.methods.mtgyOklgRatio().call(),
    ]);
    commit("SET_MTGY_OKLG_RATIO", mtgyOklgRatio);
  },

  async swapMtgyForOklg({ dispatch, getters, state }) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const mtgyCont = ERC20(web3, mtgyAddy);

    const mtgyOklgSwapAddy = getters.activeNetwork.contracts.mtgyOklgSwap;
    const contract = MTGYOKLGSwap(web3, mtgyOklgSwapAddy);

    const [userMtgyBal] = await Promise.all([
      mtgyCont.methods.balanceOf(userAddy).call(),
    ]);

    const mtgyBal = new BigNumber(userMtgyBal);
    if (!mtgyBal.gt(0)) {
      throw new Error(
        `You need to make sure you have at least some MTGY in your wallet to swap for OKLG.`
      );
    }

    await dispatch("genericErc20Approval", {
      spendAmount: userMtgyBal,
      tokenAddress: mtgyAddy,
      delegateAddress: mtgyOklgSwapAddy,
    });

    return await contract.methods.swap().send({
      from: userAddy,
    });
  },
};
