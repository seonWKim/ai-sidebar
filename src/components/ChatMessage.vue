<script setup lang="ts">
import type { Message } from '@/common/message';
import { defineComponent, onMounted, ref, watch } from 'vue';
import Markdown from 'vue3-markdown-it';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';
import { ChatTypes } from '@/common/chat-type';

const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true,
  },
  showMessageTemplate: {
    type: Boolean,
    required: false,
    default: false,
  },
  options: {
    type: Object as () => Record<string, string>,
    required: false,
    default: () => {
      return {
        imageWidth: '256px',
        imageHeight: '256px',
      };
    },
  },
});

defineComponent({
  components: {
    Markdown,
  },
});

onMounted(() => {
  if (props.message?.action !== 'sent') {
    return;
  }

  if (props.showMessageTemplate) {
    wholeMessage.value = props.message.text[0];
  } else {
    wholeMessage.value = props.message.originalText[0];
  }
});

let lastSeenIdx = 0;
const wholeMessage = ref(props.message?.text?.join('') || '');

/**
 * Watch streaming response and concatenate the strings. Only received messages are applicable
 */
watch(props.message, (newValue, _) => {
  if (props.message?.action !== 'received') {
    return;
  }

  const newLastIdx = newValue?.text.length || 0;
  const newText = newValue?.text?.slice(lastSeenIdx, newLastIdx + 1)?.join('') || '';
  lastSeenIdx = newLastIdx;
  wholeMessage.value += newText;
});

const imageLoaded = ref<Record<number, boolean>>({});
const plugins = [
  {
    plugin: MarkdownItHighlightjs,
    options: {
      css: {
        source: import('highlight.js/styles/atom-one-light.css'),
      },
    },
  },
];

function download(base64: string) {
  const el = document.createElement('a');
  el.href = getUrl(base64);
  el.download = `freeaisidebar_${new Date().getTime()}.png`;
  el.click();
}

function getUrl(base64: string) {
  return `data:image/jpeg;base64,${base64}`;
}
</script>

<template>
  <v-card>
    <v-card-text class="px-4 py-0">
      <div
        v-if="message.action === 'received' && message.type.name === ChatTypes.IMAGE.name"
        class="received-images"
      >
        <div v-for="(base64, idx) in message.text" :key="idx">
          <v-img
            :src="getUrl(base64)"
            class="received-image"
            :width="props.options.imageWidth!"
            :height="props.options.imageHeight!"
            @load="imageLoaded[idx] = true"
          >
            <div v-if="imageLoaded[idx]" class="text-right">
              <v-btn
                class="download-button"
                @click="download(base64)"
                size="small"
                color="primary"
                icon="mdi-download"
              />
            </div>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </div>
      </div>
      <markdown v-else :source="wholeMessage" class="markdown" :breaks="true" :plugins="plugins" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.received-images {
  padding: 8px 0;
}

.received-image {
  margin: 8px;
}

.download-button {
  margin: 4px;
  opacity: 0.8;
}

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
