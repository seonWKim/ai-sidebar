<script setup lang="ts">
import type { Message } from '@/common/message';
import { onMounted, ref, watch } from 'vue';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';
import { ChatTypes } from '@/common/chat-type';
import ChatMessageText from '@/components/chat/message/ChatMessageText.vue';
import ChatMessageImage from '@/components/chat/message/ChatMessageImage.vue';

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
});

onMounted(() => {
  if (props.message?.action !== 'sent') {
    return;
  }

  if (props.showMessageTemplate) {
    concatenatedMessage.value = props.message.text[0];
  } else {
    concatenatedMessage.value = props.message.originalText[0];
  }
});

let lastSeenIdx = 0;
const concatenatedMessage = ref(props.message?.text?.join('') || '');

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
  concatenatedMessage.value += newText;
});

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
</script>

<template>
  <div>
    <chat-message-text
      v-if="message.type.name === ChatTypes.TEXT.name"
      color="messages"
      :joined-message="concatenatedMessage"
      :plugins="plugins"
    />
    <chat-message-image
      v-if="message.type.name === ChatTypes.IMAGE.name"
      :message="message"
      color="messages"
      :concatenated-message="concatenatedMessage"
      :plugins="plugins"
    />
  </div>
</template>

<style scoped></style>
