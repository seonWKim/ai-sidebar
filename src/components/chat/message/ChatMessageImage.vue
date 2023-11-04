<script setup lang="ts">
import Markdown from 'vue3-markdown-it';

import { Message } from '@/common/message';
import { defineComponent, ref } from 'vue';

defineComponent({
  components: {
    Markdown,
  },
});

defineProps({
  message: {
    type: Object as () => Message,
    required: true,
  },
  concatenatedMessage: {
    type: String,
    required: true,
    default: '',
  },
  plugins: {
    type: Array,
    required: true,
  },
  borderRadius: {
    type: String,
    default: '10px'
  }
});

const imageLoaded = ref<Record<number, boolean>>({});
const options = {
  imageWidth: '256px',
  imageHeight: '256px',
};

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
  <v-card :style="{ 'border-radius': borderRadius }" color="messages">
    <v-card-text class="card-text-style">
      <div v-if="message.action === 'received'" class="received-images">
        <div v-for="(base64, idx) in message.text" :key="idx">
          <v-img
            :src="getUrl(base64)"
            class="received-image"
            :width="options.imageWidth!"
            :height="options.imageHeight!"
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
      <markdown
        v-else
        :source="concatenatedMessage"
        class="markdown"
        :breaks="true"
        :plugins="plugins"
      />
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

.card-text-style {
  padding: 0 16px;
  background-color: transparent;
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
