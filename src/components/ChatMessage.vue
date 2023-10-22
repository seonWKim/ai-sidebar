<script setup lang="ts">
import type { Message } from "@/common/message";
import { defineComponent, onMounted, ref, watch } from "vue";
import Markdown from "vue3-markdown-it";
import MarkdownItHighlightjs from "markdown-it-highlightjs";

const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true
  },
  showMessageTemplate: {
    type: Boolean,
    required: false,
    default: false
  }
});

defineComponent({
  components: {
    Markdown
  }
});

onMounted(() => {
  if (props.message?.type !== "sent") {
    return;
  }

  if (props.showMessageTemplate) {
    wholeMessage.value = props.message.text[0];
  } else {
    wholeMessage.value = props.message.originalText[0];
  }
});

let lastSeenIdx = 0;
const wholeMessage = ref(props.message?.text?.join("") || "");

/**
 * Watch streaming response and concatenate the strings. Only received messages are applicable
 */
watch(props.message, (newValue, oldValue) => {
  if (props.message?.type !== "received") {
    return;
  }

  const newLastIdx = newValue?.text.length || 0;
  const newText = newValue?.text?.slice(lastSeenIdx, newLastIdx + 1)?.join("") || "";
  lastSeenIdx = newLastIdx;
  wholeMessage.value += newText;
});

const plugins = [
  {
    plugin: MarkdownItHighlightjs,
    options: {
      css: {
        source: import("highlight.js/styles/atom-one-light.css")
      }
    }
  }
];

</script>

<template>
  <v-card>
    <v-card-text class="px-4 py-0">
      <markdown :source="wholeMessage"
                class="markdown"
                :breaks="true"
                :plugins="plugins" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.markdown {
  padding: 0 8px;
}

.markdown ::v-deep(code) {
  white-space: pre-wrap !important;
}

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
