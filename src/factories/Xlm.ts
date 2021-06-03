import axios from "axios";
import BigNumber from "bignumber.js";
import StellarSdk, { Memo } from "stellar-sdk";

export default function Xlm(
  secretSeed?: string,
  serverUrl: string = "https://horizon.stellar.org", // 'https://horizon-testnet.stellar.org'
  networkPassphraseKey: "PUBLIC" | "TESTNET" = "PUBLIC" // 'TESTNET'
) {
  return {
    secretSeed,
    serverUrl,

    server: new StellarSdk.Server(serverUrl),

    getStellarHash(data: Buffer | string): Memo {
      return StellarSdk.Memo.hash(data);
    },

    async getTxn(txnHash: string) {
      return await this.server.transactions().transaction(txnHash).call();
    },

    async accountTxnHistory(
      targetPublicKey: string,
      currentRecords: any[] = [],
      page: any = null
    ): Promise<any[]> {
      if (page) {
        const newPage = await page.next();
        if (newPage.records.length > 0)
          return await this.accountTxnHistory(
            targetPublicKey,
            currentRecords.concat(newPage.records),
            newPage
          );

        return currentRecords;
      }

      const firstPage = await this.server
        .transactions()
        .forAccount(targetPublicKey)
        .call();

      return await this.accountTxnHistory(
        targetPublicKey,
        currentRecords.concat(firstPage.records),
        firstPage
      );
    },

    // modeled off the code written here:
    // https://www.stellar.org/developers/js-stellar-sdk/reference/examples.html#creating-a-payment-transaction
    async txn(
      dataSha256Hash: string,
      targetPubKey: string,
      amountUsdToSend: number = 0.5
    ) {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretSeed);
      const sourcePublicKey = sourceKeypair.publicKey();

      const [sourceAccount, fee] = await Promise.all([
        this.server.loadAccount(sourcePublicKey),
        this.server.fetchBaseFee(),
      ]);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: StellarSdk.Networks[networkPassphraseKey],
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: targetPubKey,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents XLM.
            asset: StellarSdk.Asset.native(),
            amount: await getXlmPerUsdAmount(amountUsdToSend), // want to send $0.50 USD worth of XLM to target account
          })
        )
        // Make this transaction valid for the next 30 seconds only
        .setTimeout(30)
        // Add a memo with hash of data
        // https://www.stellar.org/developers/learn/concepts/transactions.html
        .addMemo(this.getStellarHash(dataSha256Hash))
        .build();

      // Sign this transaction with the secret key
      transaction.sign(sourceKeypair);
      return await this.server.submitTransaction(transaction);
    },
  };
}

export async function getXlmPerUsdAmount(
  usd: number | string
): Promise<string> {
  // 'amount' is price XLM/USD
  const {
    data: {
      data: { amount },
    },
  } = await axios.get("https://api.coinbase.com/v2/prices/XLM-USD/buy");
  return new BigNumber(usd).div(amount).toFixed(7);
}
