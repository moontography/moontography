<template>
  <card class="card-stats">
    <div class="statistics statistics-horizontal">
      <div class="info info-horizontal">
        <div class="row">
          <div class="col-5" v-if="$slots.icon || icon">
            <div class="icon icon-circle" :class="`icon-${type}`">
              <slot name="icon">
                <i :class="icon"></i>
              </slot>
            </div>
          </div>
          <div class="col-7 text-right" v-if="$slots.content || title">
            <h3 v-if="title" class="info-title">{{ title }}</h3>
            <!-- <h6 v-if="subTitle" class="stats-title">{{ subTitle }}</h6> -->
            <div v-if="subTitle" class="stats-title">{{ subTitle }}</div>
            <!-- <slot></slot> -->
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
    <template v-slot:footer>
      <div class="stats" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </card>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "stats-card",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: String,
    title: String,
    subTitle: String,
  },
};
</script>
<style></style>
