<script setup lang="ts">
import type { Message } from "@/common/message";
import { defineComponent, ref, watch } from "vue";
import Markdown from "vue3-markdown-it"
import MarkdownItHighlightjs from "markdown-it-highlightjs";

const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true
  }
});

defineComponent({
  components: {
    Markdown
  }
});

const plugins = [
  {
    plugin: MarkdownItHighlightjs,
    options: {
      css: {
        source: import('highlight.js/styles/atom-one-light.css')
      }
    }
  }
];

let lastSeenIdx = 0;
const wholeMessage = ref(props.message?.text?.join("") || "");
watch(props.message, (newValue, oldValue) => {
  const newLastIdx = newValue?.text.length || 0;
  const newText = newValue?.text?.slice(lastSeenIdx, newLastIdx + 1)?.join("") || "";
  lastSeenIdx = newLastIdx;
  wholeMessage.value += newText;
});

</script>

<template>
  <v-card>
    <v-card-text>
      <markdown :source="wholeMessage"
                class="markdown px-4"
                :plugins="plugins" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.markdown ::v-deep(pre) {
  margin: 12px 0;
}

.markdown ::v-deep(p) {
  margin: 12px 0;
}

.markdown ::v-deep(code) {
  border-radius: 8px;
}
</style>
