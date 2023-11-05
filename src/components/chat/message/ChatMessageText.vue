<script setup lang="ts">
import Markdown from 'vue3-markdown-it';
import { defineComponent } from 'vue';
import { eventBus, EventName } from '@/common/event';

defineComponent({
  components: {
    Markdown,
  },
});

const props = defineProps({
  joinedMessage: {
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
    default: '10px',
  },
  enableCopy: {
    type: Boolean,
    default: false,
  },
});

function copyText() {
  const textarea = document.createElement('textarea');
  textarea.value = props.joinedMessage;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: 'Copied',
    color: 'primary',
  });
}
</script>

<template>
  <div v-if="enableCopy" class="cy-copy-btn">
    <v-tooltip text="copy" max-width="300px" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-content-copy"
          @click="copyText"
          v-bind="props"
          size="x-small"
          flat
          density="compact"
        />
      </template>
    </v-tooltip>
  </div>
  <v-card :style="{ 'border-radius': borderRadius }" color="messages">
    <v-card-text class="card-text-style">
      <markdown :source="joinedMessage" class="markdown" :breaks="true" :plugins="plugins" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.card-text-style {
  padding: 0 16px;
  background-color: transparent;
}

.cy-copy-btn {
  padding: 8px;
  display: flex;
  justify-content: end;
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
