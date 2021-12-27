import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import Cryptography from "browser-cryptography";
import { v1 as uuidv1 } from "uuid";
// import MTGY from "../../factories/web3/MTGY";
import MTGYPasswordManager from "../../factories/web3/MTGYPasswordManager";
import TxnToast from "@/components/TxnToast";
import { useToast } from "vue-toastification";
const toast = useToast();

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
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const passwordManagerAddy = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const pwCont = MTGYPasswordManager(web3, passwordManagerAddy);

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

    const basePwMgrCost = await pwCont.methods.mtgyServiceCost().call();
    await dispatch("genericErc20Approval", {
      spendAmount: new BigNumber(basePwMgrCost)
        .times(accounts.length)
        .div(2)
        .toFixed(0),
      tokenAddress: mtgyAddy,
      delegateAddress: passwordManagerAddy,
    });

    const tx = await pwCont.methods
      .bulkAddAccounts(encryptedAccounts)
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
    return { key: encryptedAccounts[0].key };
  },

  async sendPasswordManagerAccountTxn({ dispatch, getters, state }, account) {
    const userAddy = state.web3.address;
    const encryptionKey = state.passwordManager.encryptionKey;
    const mtgyAddy = getters.activeNetwork.contracts.mtgy;
    const passwordManagerAddy = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const pwCont = MTGYPasswordManager(web3, passwordManagerAddy);

    // store the account
    const crypt = Cryptography();
    const { iv, key, ciphertext } = await crypt.encryptMessage(
      JSON.stringify(account),
      encryptionKey
    );
    const ivBase64 = crypt.arrayBufferOrUint8ArrayToBase64(iv);
    const keyBase64 = await crypt.cryptoKeyToBase64(key);
    const ciphertextBase64 = crypt.arrayBufferOrUint8ArrayToBase64(ciphertext);

    let tx;
    if (account.id) {
      tx = await pwCont.methods
        .updateAccountById(account.id, ivBase64, ciphertextBase64)
        .send({ from: userAddy });
    } else {
      // make sure the current user has allowed the appropriate amount of MTGY to
      // spend on the service
      await dispatch("genericErc20Approval", {
        spendAmount: await pwCont.methods.mtgyServiceCost().call(),
        tokenAddress: mtgyAddy,
        delegateAddress: passwordManagerAddy,
      });

      tx = await pwCont.methods
        .addAccount(uuidv1(), ivBase64, ciphertextBase64)
        .send({ from: userAddy });
    }
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
    return { iv: ivBase64, key: keyBase64, ciphertext: ciphertextBase64 };
  },

  async deletePasswordManagerAccount({ getters, state }, accountId) {
    const userAddy = state.web3.address;
    const passwordManagerAddy = getters.activeNetwork.contracts.passwordManager;
    const web3 = state.web3.instance;
    const pwCont = MTGYPasswordManager(web3, passwordManagerAddy);
    const tx = await pwCont.methods
      .deleteAccount(accountId)
      .send({ from: userAddy });
    const content = {
      component: TxnToast,
      props: {
        transactionHash: tx.transactionHash,
        activeNetworkExplorerUrl: getters.activeNetworkExplorerUrl,
      },
    };
    toast.success(content, { timeout: 10000 });
    return tx;
  },
};
