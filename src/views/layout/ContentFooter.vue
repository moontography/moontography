<template lang="pug">
footer.footer
  div.container-fluid.d-flex.flex-wrap.justify-content-between
    nav
      ul.footer-menu.text-uppercase
        li {{ $route.name }}
    div.copyright
      | &copy; {{ year }},
      a.ml-1(
        href="https://moontography.com/"
        target="_blank"
        rel="noopener noreferrer") Moontography
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
