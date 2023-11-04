<script setup lang="ts">
import Markdown from 'vue3-markdown-it';
import { defineComponent } from 'vue';

defineComponent({
  components: {
    Markdown,
  },
});

defineProps({
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
});
</script>

<template>
  <v-card :style="{ 'border-radius': borderRadius }">
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
