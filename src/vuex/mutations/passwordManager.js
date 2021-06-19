export default {
  SET_PASSWORD_MANAGER_ENCRYPTION_KEY(state, key) {
    state.passwordManager.encryptionKey = key;
  },

  SET_PASSWORD_MANAGER_COST(state, cost) {
    state.passwordManager.cost = cost;
  },

  SET_PASSWORD_MANAGER_ACCOUNTS(state, accounts) {
    state.passwordManager.accounts = accounts;
  },
};
