<template>
  <svg aria-hidden="true" :class="svgClass">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon",
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#333",
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    const svgClass = computed(() => {
      return props.prefix ? `svg-icon ${props.prefix}` : "svg-icon";
    });
    return { symbolId, svgClass };
  },
});
</script>
<style scoped>
.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.18em;
  fill: currentColor;
  overflow: hidden;
}
</style>
