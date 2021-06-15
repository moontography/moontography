import BigNumber from "bignumber.js";
import Cryptography from "browser-cryptography";
import { v1 as uuidv1 } from "uuid";
import MTGY from "../../factories/web3/MTGY";
import MTGYPasswordManager from "../../factories/web3/MTGYPasswordManager";

export default {
  async getPasswordManagerEncryptionKey({ commit }) {
    commit(
      "SET_PASSWORD_MANAGER_ENCRYPTION_KEY",
      localStorage.mtgyPasswordManagerEncryptionKey
        ? await Cryptography().base64ToCryptoKey(
            localStorage.mtgyPasswordManagerEncryptionKey
          )
        : null
    );
  },

  async getPasswordManagerCost({ commit, getters, state }) {
    const web3 = state.web3.instance;
    const passwordManager = getters.activeNetwork.contracts.passwordManager;
    const pwCont = MTGYPasswordManager(web3, passwordManager);
    const cost = await pwCont.methods.mtgyServiceCost().call();
    commit(
      "SET_PASSWORD_MANAGER_COST",
      new BigNumber(cost).div(new BigNumber(10).pow(18)).toString()
    );
  },

  async getPasswordManagerAccounts({ commit, getters, state }) {
    const userAddy = state.web3.address;
    const pwMgrAddress = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const encryptionKey = state.passwordManager.encryptionKey;
    if (!encryptionKey) return;
    const pwCont = MTGYPasswordManager(web3, pwMgrAddress);
    const accounts = await pwCont.methods.getAllAccounts(userAddy).call();
    const crypt = Cryptography();
    const decryptedAccounts = await Promise.all(
      accounts.map(async (a) => {
        const decrypted = await crypt.decryptMessage({
          key: encryptionKey,
          ciphertext: crypt.base64ToArrayBuffer(a.ciphertext),
          iv: new Uint8Array(crypt.base64ToArrayBuffer(a.iv)),
        });
        return { ...a, ...JSON.parse(decrypted) };
      })
    );
    commit("SET_PASSWORD_MANAGER_ACCOUNTS", decryptedAccounts);
  },

  async sendPasswordManagerAccountTxn({ getters, state }, account) {
    const userAddy = state.web3.address;
    const encryptionKey = state.passwordManager.encryptionKey;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const passwordManagerAddy = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const mtgyCont = MTGY(web3, mtgyAddy);
    const pwCont = MTGYPasswordManager(web3, passwordManagerAddy);

    // make sure the current user has allowed the appropriate amount of MTGY to
    // spend on the service
    const [currentApprovalAmount, currentPwCost] = await Promise.all([
      mtgyCont.methods.allowance(userAddy, passwordManagerAddy).call(),
      pwCont.methods.mtgyServiceCost().call(),
    ]);
    if (new BigNumber(currentApprovalAmount).lt(currentPwCost)) {
      await mtgyCont.methods
        .approve(passwordManagerAddy, currentPwCost)
        .send({ from: userAddy });
    }

    // store the account
    const crypt = Cryptography();
    const { iv, key, ciphertext } = await crypt.encryptMessage(
      JSON.stringify(account),
      encryptionKey
    );
    const ivBase64 = crypt.arrayBufferOrUint8ArrayToBase64(iv);
    const keyBase64 = await crypt.cryptoKeyToBase64(key);
    const ciphertextBase64 = crypt.arrayBufferOrUint8ArrayToBase64(ciphertext);
    if (account.id) {
      await pwCont.methods
        .updateAccount(account.id, ciphertextBase64)
        .send({ from: userAddy });
    } else {
      await pwCont.methods
        .addAccount(uuidv1(), ivBase64, ciphertextBase64)
        .send({ from: userAddy });
    }
    return { iv: ivBase64, key: keyBase64, ciphertext: ciphertextBase64 };
  },
};
