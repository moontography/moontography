<template lang="pug">
div
  h4
    a.text-dark(
      style="cursor: pointer"
      data-toggle="collapse"
      :data-target="`#collapsible-${index}`") {{ question }}
  div.collapse(:id="`collapsible-${index}`")
    div.card
      div.card-body
        div(v-html="answerHtml")
</template>

<script>
export default {
  name: "TTFaq",
  props: {
    index: { type: Number },
    question: { type: String },
    answerHtml: { type: String },
  },
};
</script>
