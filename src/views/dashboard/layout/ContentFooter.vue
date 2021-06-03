<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu text-uppercase">
          <li>
            {{ $route.name }}
          </li>
        </ul>
      </nav>
      <div class="copyright">
        &copy; {{ year }},
        <a href="https://moontography.com/">Moontography</a>
      </div>
    </div>
  </footer>
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
<style></style>
