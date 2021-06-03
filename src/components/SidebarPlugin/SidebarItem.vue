<template>
  <component :is="baseComponent" :class="{ active: isActive }">
    <a
      v-if="isMenu"
      :href="'#' + link.name"
      class="nav-link sidebar-menu-item"
      :aria-expanded="!collapsed"
      data-toggle="collapse"
      @click.prevent="collapseMenu"
      role="button"
      :aria-controls="link.name"
    >
      <i :class="link.icon"></i>
      <p>
        {{ link.name }}
        <b class="caret"></b>
      </p>
    </a>

    <div
      class="collapse"
      :id="link.name"
      v-if="this.$slots.default || this.isMenu"
    >
      <ul class="nav links__nav">
        <slot></slot>
      </ul>
    </div>

    <slot
      name="title"
      v-if="children.length === 0 && !this.$slots.default && link.path"
    >
      <component
        :to="link.path"
        :is="elementType(link, true)"
        class="nav-link"
        :target="link.target"
        :href="link.path"
      >
        <template v-if="addLink">
          <span class="sidebar-mini-icon">{{ linkPrefix }}</span>
          <span class="sidebar-normal">{{ link.name }}</span>
        </template>
        <template v-else>
          <i :class="link.icon"></i>
          <p>{{ link.name }}</p>
        </template>
      </component>
    </slot>
  </component>
</template>
<script>
export default {
  name: "sidebar-item",
  props: {
    menu: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Object,
      default: () => {
        return {
          name: "",
          path: "",
          children: [],
        };
      },
    },
  },
  provide() {
    return {
      addLink: this.addChild,
      removeLink: this.removeChild,
    };
  },
  inject: {
    addLink: { default: null },
    removeLink: { default: null },
    autoClose: {
      default: true,
    },
  },
  data() {
    return {
      children: [],
      collapsed: true,
    };
  },
  computed: {
    baseComponent() {
      return "li";
    },
    linkPrefix() {
      if (this.link.name) {
        let words = this.link.name.split(" ");
        return words.map((word) => word.substring(0, 1)).join("");
      }
      return ``;
    },
    isMenu() {
      return this.children.length > 0 || this.menu === true;
    },
    isActive() {
      if (this.$route && this.$route.path) {
        let matchingRoute = this.children.find((c) =>
          this.$route.path.startsWith(c.link.path)
        );
        if (matchingRoute !== undefined) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    start(el) {
      el.style.height = el.scrollHeight + "px";
    },
    end(el) {
      el.style.height = "";
    },
    addChild(item) {
      const index = this.$slots.default().indexOf(item.$vnode);
      this.children.splice(index, 0, item);
    },
    removeChild(item) {
      const tabs = this.children;
      const index = tabs.indexOf(item);
      tabs.splice(index, 1);
    },
    elementType(link, isParent = true) {
      if (link.isRoute === false) {
        return isParent ? "li" : "a";
      } else {
        return "router-link";
      }
    },
    linkAbbreviation(name) {
      const matches = name.match(/\b(\w)/g);
      return matches.join("");
    },
    linkClick() {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false);
      }
    },
    collapseMenu() {
      this.collapsed = !this.collapsed;
    },
    collapseSubMenu(link) {
      link.collapsed = !link.collapsed;
    },
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
    if (this.link.collapsed !== undefined) {
      this.collapsed = this.link.collapsed;
    }
    if (this.isActive && this.isMenu) {
      this.collapsed = false;
    }
  },
  unmounted() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  },
};
</script>
<style>
.sidebar-menu-item {
  cursor: pointer;
}
.sidebar ul.links__nav {
  margin-top: 0;
  padding-top: 10px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
  height: auto !important;
}

.slide-fade-leave-active {
  transition: all 0.8s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  height: 0 !important;
}
</style>
