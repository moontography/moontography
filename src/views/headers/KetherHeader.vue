<template lang="pug">
div.panel-header
  div.header.text-center
    h2.title Thousand Ether Homepage Lending
    p.category.text-white
      div.text-white
        | Statistics on the Thousand Ether Homepage.
        a.ml-1.text-white(
          href="https://thousandetherhomepage.com/"
          target="_blank"
          rel="noopener noreferrer")
            u Check it out now!
      div
        a.mr-2(
          href="https://twitter.com/ketherhomepage"
          target="_blank"
          rel="noopener noreferrer")
            n-button.btn-twitter(type="neutral" social icon round)
              i.fa.fa-twitter
        a.mr-2(
          href="https://github.com/thousandetherhomepage"
          target="_blank"
          rel="noopener noreferrer")
            n-button.btn-github(type="neutral" social icon round)
              i.fa.fa-github
        a(
          href="https://discord.com/invite/kMb7hXaaER"
          target="_blank"
          rel="noopener noreferrer")
            n-button.btn-discord(type="neutral" social icon round)
              img.img-fluid(style="max-width: 20px" src="img/discord.png")
</template>

<script>
export default {};
</script>

<style scoped>
.category {
  text-transform: inherit;
}
</style>
