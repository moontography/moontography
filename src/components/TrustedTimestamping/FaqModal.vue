<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='faq-modal'
  aria-hidden='true')
    .modal-dialog.modal-lg
      .modal-content
        .modal-header
          h5.modal-title What is Blockchain Trusted Timestamping?
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.row.flex-center
            div.col.d-flex.justify-content-center
              img.no-border(
                alt="Moontography"
                style="max-width: 200px; margin: 0px auto;"
                src="img/logo-nn.png")
          div.row.flex-center
            div.col
              h2.text-center(style="margin: 0.5rem 0rem 1rem 0rem;") Blockchain Trusted Timestamping
          div.row.flex-center
            div.col
              h4.m-0.text-center What is this?
          p
            | Store digital signatures of your files on the blockchain to be validated
            | at a later time for tamper proofing or other use cases.
          p
            | Blockchain was developed with some core
            | central properties (decentralization, transparency, and immutability) 
            | that make it attractive for certain use cases. 
            | These properties enable and empower transparent and secure financial systems in addition
            | to several creative use cases that are not particularly main stream today.
            | By understanding and utilizing things like #[a(href="https://en.wikipedia.org/wiki/SHA-2") SHA-2 hashing]
            | and transparency and immutability within the blockchain, it's possible to store 
            | digital signatures of information/data in order to
            | at a later time come back and validate with certainty that this
            | information was in fact true and existed at a particular snapshot in time.
          p
            | Why would this be valuable or important? Think of legal cases when
            | you want to authenticate a video, audio, or document existed at a particular
            | point in time. If the digital hash of this file existed in the blockchain
            | at the time alleged and we can take the current file, calculate it's digital
            | signature now and compare it to the blockchain's stored signature, we can
            | confirm there has been no tampering of that file since then.
          div.row
            div.col-12
              h3.text-center FAQ's
            all-faqs.col-12
</template>

<script>
import AllFaqs from "./AllFaqs";
export default {
  name: "TTFaqModal",
  components: {
    AllFaqs,
  },
};
</script>
