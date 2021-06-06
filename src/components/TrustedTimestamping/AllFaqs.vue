<template lang="pug">
div
  div(v-for="(faq, index) in faqs")
    faq.mb-3(
      :index="index"
      :question="faq.question"
      :answer-html="faq.answerHtml")
</template>

<script>
import { mapState } from "vuex";
import Faq from "./Faq";

export default {
  name: "TTAllFaqs",
  components: {
    Faq,
  },
  computed: {
    ...mapState({
      usdToSend: (state) => state.xlm.usdToSend,
    }),

    faqs() {
      return [
        {
          question: "How does this work?",
          answerHtml: `
            <p>
              The process is as follows:
              <ol>
                <li>
                  Add the file you want to store its signature on the blockchain. The process of
                  calculating its digital signature is done 100% on your computer and never leaves. If you
                  don't believe me, check your network tab, I promise I'm just trying to utilize the stellar
                  blockchain in a cool way, not steal your stuff.
                </li>
                <li>
                  Add the private key of an account on the blockchain that will be
                  used to create a transaction with the file data signature located in the memo
                  of the transaction. This account should have at least $${this.usdToSend}USD worth of XLM
                  in it in order to execute the transaction.
                </li>
                <li>
                  Process the transaction to the blockchain. The file signature is now perpetually
                  stored and can be validated against at any point in the future!
                </li>
              </ol>
            </p>
          `,
        },
        {
          question: "Is there any cost associated with using this?",
          answerHtml: `
            <p>
              There is no cost if you want to put in a little effort
              to host blockchain-trusted-timestamping app yourself. You are welcome to fork and run locally or
              host it yourself online and use with your own public key target account and the
              only cost would be the associated transaction fees on the stellar network (which are VERY small).
              If you want to use this app hosted here (without hosting yourself) 
              we ask for $${this.usdToSend} (USD) per file hash stored on the blockchain. Therefore, the private key
              you enter to execute the transaction on the blockchain with the file hash in the memo
              should have $${this.usdToSend} USD worth of XLM in it in order for the transaction to execute.
            </p>
          `,
        },
        {
          question: "What is a SHA256 Hash?",
          answerHtml: `
            <p>
              Imagine taking a piece of data (a text file,
              a video file, a word like 'grandpa', absolutely ANYTHING) and running it through a
              mathematical formula that outputs a string of constant length that "signs" that piece
              of data. If you've ever heard someone say that this is a "digital signature" that's
              what they mean. That's basically what a hash is, and there is such a large combination of
              strings that make up the total number of possible combinations that it becomes unwieldy
              and virtually impossible (but obviously not "technical" impossible) to take a piece of data
              and produce the same hash. The point is though that you can take your data/file and create
              a "signature" of it, and it will in all intents and purposes identify it without being able
              to reverse engineer it.
            </p>
          `,
        },
        {
          question: "Is my private key/secret seed safe?",
          answerHtml: `
            <p>
              As long as your computer is secure, then yes.
              There are no servers associated with blockchain-trusted-timestamping and we use <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">local storage</a>
              to store your private key so you don't have to enter it every time you upload a file.
              For the non technical, this just means the key is stored on your computer file system,
              and is not stored anywhere on the internet.
            </p>`,
        },
        {
          question: `I still don't trust you, but I want to use this tool. What do I do?`,
          answerHtml: `
            <p>
              I don't blame you since I don't even trust myself half of the time. If
              you want to use this tool as a standalone utility feel free to fork it and
              enter your own public or private keys on your own machines in the tool. I'm not a hacker
              or a malicious person, just a dad of a 7 month old and 2 cats and a fan of the stellar blockchain :)
            </p>
          `,
        },
      ];
    },
  },
};
</script>
