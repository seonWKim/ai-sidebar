<script setup lang="ts">
import { ref, watch } from 'vue';
import { OpenaiModel } from '@/service/openai';
import { appStore } from '@/store/app';

const store = appStore();
const models = ref(Object.values(OpenaiModel));
const selectedModel = ref<OpenaiModel>(OpenaiModel['gpt-3.5-turbo']);

watch(selectedModel, (newVal) => {
  store.updateOpenaiModel(newVal);
});

/**
 * Select a role from the list of {@link OpenaiModel} values.
 * Used as a parameter for OpenAI API request.
 * @param modelStr OpenAi Model
 */
function selectModel(modelStr: string) {
  selectedModel.value =
    Object.values(OpenaiModel).find((key) => OpenaiModel[key] === modelStr) ||
    OpenaiModel['gpt-3.5-turbo'];
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
        class="cy-openai-model-selector-button"
        v-bind="props"
      >
        {{ selectedModel.toUpperCase() }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(model, index) in models" :key="index" @click="selectModel(model)">
        <v-list-item-title>{{ model }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.cy-openai-model-selector-button {
  margin-right: 8px;
}
</style>
