import BigNumber from "bignumber.js";
import MTGY from "../../factories/web3/MTGY";
import MTGYAirdropper from "../../factories/web3/MTGYAirdropper";
import TxnToast from "@/components/TxnToast";
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  async getAirdropperCost({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const airdropperCont = getters.activeNetwork.contracts.airdropper;
    const contract = MTGYAirdropper(web3, airdropperCont);
    const cost = await contract.methods.mtgyServiceCost().call();
    commit(
      "SET_AIRDROPPER_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async airdropTokens(
    { dispatch, getters, state },
    { tokenAddress, addresses, isNft }
  ) {
    const web3 = state.web3.instance;
    const userAddy = state.web3.address;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const airdropAddy = getters.activeNetwork.contracts.airdropper;
    const mtgyCont = MTGY(web3, mtgyAddy);
    const airdropContract = MTGYAirdropper(web3, airdropAddy);
    const [tokenInfo, mtgyBalance, serviceCost] = await Promise.all([
      dispatch(
        isNft ? "getErc721TokenInfo" : "getErc20TokenInfo",
        tokenAddress
      ),
      mtgyCont.methods.balanceOf(userAddy).call(),
      airdropContract.methods.mtgyServiceCost().call(),
    ]);
    if (new BigNumber(mtgyBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have the amount of MTGY to cover the service cost. Please ensure you have enough MTGY in your wallet to cover the service fee and try again.`
      );
    }

    await dispatch("genericErc20Approval", {
      spendAmount: serviceCost,
      tokenAddress: mtgyAddy,
      delegateAddress: airdropAddy,
    });

    const addressesFormatted = addresses.map(({ address, tokens }) => {
      return {
        userAddress: address,
        amountToReceive: isNft
          ? new BigNumber(tokens).toFixed(0)
          : new BigNumber(tokens)
            .times(new BigNumber(10).pow(tokenInfo.decimals))
            .toFixed(0),
      };
    });

    const totalAmount = isNft
      ? addressesFormatted.length
      : addressesFormatted.reduce(
        (total, info) =>
          new BigNumber(total).plus(info.amountToReceive).toFixed(0),
        0
      );
    if (new BigNumber(tokenInfo.userBalance).lt(totalAmount)) {
      throw new Error(
        `You do not have the amount of ${tokenInfo.symbol} to airdrop this many tokens. Please ensure you have the appropriate amount of tokens and try again.`
      );
    }

    // Approve airdrop contract to send rewards token from airdropper
    if (isNft) {
      await dispatch("genericErc721Approval", {
        tokenAddress: tokenAddress,
        delegateAddress: airdropAddy,
      });
    } else {
      await dispatch("genericErc20Approval", {
        spendAmount: totalAmount,
        tokenAddress: tokenAddress,
        delegateAddress: airdropAddy,
      });
    }

    let airdropMethod = "bulkSendErc20Tokens";
    if (isNft) {
      airdropMethod = "bulkSendErc721Tokens";
    }

    const tx = await airdropContract.methods[airdropMethod](
      tokenAddress,
      addressesFormatted.map(({ userAddress, amountToReceive }) => [
        userAddress,
        amountToReceive,
      ])
    ).send({ from: userAddy });

    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
  },
};
