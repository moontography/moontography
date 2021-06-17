import MTGYFaaSToken from "../../factories/web3/MTGYFaaSToken";

export default {
  async faasHarvestTokens({ state }, tokenAddy) {
    const userAddy = state.web3.address;
    // const faasAddress = getters.activeNetwork.contracts.faas;
    const web3 = state.web3.instance;
    const contract = MTGYFaaSToken(web3, tokenAddy);
    await contract.methods.harvestTokens().send({ from: userAddy });
  },
};
