<script setup lang="ts">
import { ref } from 'vue';
import { OpenaiModel } from '@/service/openai';

const props = defineProps({
  selectedModel: {
    type: String,
    default: OpenaiModel['gpt-3.5-turbo'],
  },
  customStyle: {
    type: String,
    default: null,
  },
});

const emits = defineEmits(['updateOpenaiModel']);

const models = ref(Object.values(OpenaiModel));
const selectedModel = ref(props.selectedModel);

/**
 * Select a role from the list of {@link OpenaiModel} values.
 * Used as a parameter for OpenAI API request.
 * @param modelStr OpenAi Model
 */
function selectModel(modelStr: string) {
  selectedModel.value =
    Object.values(OpenaiModel).find((key) => OpenaiModel[key] === modelStr) ||
    OpenaiModel['gpt-3.5-turbo'];
  emits('updateOpenaiModel', selectedModel.value);
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        size="x-small"
        prepend-icon="mdi-brain"
        rounded
        variant="outlined"
        color="primary"
        :class="customStyle"
        v-bind="props"
      >
        {{ selectedModel }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(model, index) in models" :key="index" @click="selectModel(model)">
        <v-list-item-title>{{ model }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped></style>
