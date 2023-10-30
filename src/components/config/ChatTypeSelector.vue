<script setup lang="ts">
import { ref } from 'vue';
import { ChatType, ChatTypes } from '@/common/chat-type';

const props = defineProps({
  selectedChatType: {
    type: ChatType,
    default: ChatTypes.TEXT,
  },
  customStyle: {
    type: String,
    default: null,
  },
});

const emits = defineEmits(['updateChatType']);

const chatTypes: ChatType[] = Object.values(ChatTypes);
const selectedChatType = ref<ChatType>(props.selectedChatType!);

/**
 * Select a role from the list of {@link OpenaiModel} values.
 * Used as a parameter for OpenAI API request.
 * @param chatTypeStr OpenAi Model
 */
function selectModel(chatTypeStr: ChatType) {
  selectedChatType.value = chatTypeStr;
  emits('updateChatType', selectedChatType.value);
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        size="x-small"
        :prepend-icon="selectedChatType.icon"
        rounded
        variant="outlined"
        color="primary"
        :class="customStyle"
        v-bind="props"
      >
        {{ selectedChatType.name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(model, index) in chatTypes" :key="index" @click="selectModel(model)">
        <v-list-item-title>{{ model.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped></style>
