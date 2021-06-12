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
                  don't believe me, check your network tab, I promise I'm just trying to utilize the
                  blockchain in a cool way, not steal your stuff.
                </li>
                <li>
                  Add the private key of an account on the blockchain that will be
                  used to create a transaction with the file data signature located in the memo
                  of the transaction.
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
              only cost would be the associated transaction fees on the blockchain.
              If you want to use this app hosted here (without hosting yourself) you will spend MTGY in order
              to store the digital signatures of your files on chain.
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
              and virtually impossible (but obviously not "technically" impossible) to take a piece of data
              and produce the same hash. The point though is that you can take your data/file and create
              a "signature" of it, and it will in all intents and purposes identify it without being able
              to reverse engineer it.
            </p>
          `,
        },
      ];
    },
  },
};
</script>
