import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import Cryptography from "browser-cryptography";
import { v1 as uuidv1 } from "uuid";
import OKLGPasswordManager from "../../factories/web3/OKLGPasswordManager";

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

  async getPasswordManagerCost({ commit, dispatch, getters, state }) {
    const productContract = getters.activeNetwork.contracts.passwordManager;
    const productID = state.productIds.passwordManager;
    const cost = await dispatch("getProductCostWei", {
      productID,
      productContract,
    });
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
    const pwCont = OKLGPasswordManager(web3, pwMgrAddress);
    const accounts = await pwCont.methods.getAllAccounts(userAddy).call();
    const crypt = Cryptography();
    const decryptedAccounts = await Promise.all(
      accounts.map(async (a) => {
        try {
          const decrypted = await crypt.decryptMessage({
            key: encryptionKey,
            ciphertext: crypt.base64ToArrayBuffer(a.ciphertext),
            iv: new Uint8Array(crypt.base64ToArrayBuffer(a.iv)),
          });
          const oDec = JSON.parse(decrypted);
          return { ...a, ...oDec, id: oDec.id || a.id };
        } catch (err) {
          console.error(`Error decrypting account`, err);
          return null;
        }
      })
    );
    commit(
      "SET_PASSWORD_MANAGER_ACCOUNTS",
      decryptedAccounts.filter((a) => !!a && !a.isDeleted)
    );
  },

  async bulkUploadPasswordManagerAccountsTxn(
    { commit, dispatch, getters, state },
    accounts
  ) {
    const userAddy = state.web3.address;
    const encryptionKey = state.passwordManager.encryptionKey;
    const productContract = getters.activeNetwork.contracts.passwordManager;
    const productID = state.productIds.passwordManager;
    const nativeCurrencySymbol = getters.nativeCurrencySymbol;
    const web3 = state.web3.instance;
    const pwCont = OKLGPasswordManager(web3, productContract);

    const crypt = Cryptography();
    const encryptedAccounts = await Promise.all(
      accounts.map(async (account) => {
        // store the accounts
        const { iv, key, ciphertext } = await crypt.encryptMessage(
          JSON.stringify(account),
          encryptionKey
        );
        const ivBase64 = crypt.arrayBufferOrUint8ArrayToBase64(iv);
        const keyBase64 = await crypt.cryptoKeyToBase64(key);
        const ciphertextBase64 = crypt.arrayBufferOrUint8ArrayToBase64(
          ciphertext
        );
        if (!encryptionKey) commit("SET_PASSWORD_MANAGER_ENCRYPTION_KEY", key);
        return {
          id: uuidv1(),
          iv: ivBase64,
          key: keyBase64,
          ciphertext: ciphertextBase64,
          timestamp: dayjs().unix(),
          isDeleted: false,
        };
      })
    );

    const [nativeBalance, serviceCost] = await Promise.all([
      state.web3.instance.eth.getBalance(userAddy),
      dispatch("getProductCostWei", {
        productID,
        productContract,
      }),
    ]);
    if (new BigNumber(nativeBalance).lt(serviceCost)) {
      throw new Error(
        `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
      );
    }

    await pwCont.methods
      .bulkAddAccounts(encryptedAccounts)
      .send({ from: userAddy, value: serviceCost });

    return { key: encryptedAccounts[0].key };
  },

  async sendPasswordManagerAccountTxn({ dispatch, getters, state }, account) {
    const userAddy = state.web3.address;
    const encryptionKey = state.passwordManager.encryptionKey;
    const productContract = getters.activeNetwork.contracts.passwordManager;
    const productID = state.productIds.passwordManager;
    const web3 = state.web3.instance;
    const pwCont = OKLGPasswordManager(web3, productContract);

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
        .updateAccountById(account.id, ivBase64, ciphertextBase64)
        .send({ from: userAddy });
    } else {
      await pwCont.methods
        .addAccount(uuidv1(), ivBase64, ciphertextBase64)
        .send({
          from: userAddy,
          value: await dispatch("getProductCostWei", {
            productID,
            productContract,
          }),
        });
    }
    return { iv: ivBase64, key: keyBase64, ciphertext: ciphertextBase64 };
  },

  async deletePasswordManagerAccount({ getters, state }, accountId) {
    const userAddy = state.web3.address;
    const passwordManagerAddy = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const pwCont = OKLGPasswordManager(web3, passwordManagerAddy);
    return await pwCont.methods
      .deleteAccount(accountId)
      .send({ from: userAddy });
  },
};
