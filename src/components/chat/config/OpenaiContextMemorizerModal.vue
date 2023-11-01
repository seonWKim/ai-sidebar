<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { appStore } from '@/store/app';
import { ChromeStorageKeys } from '@/common/keys';

onMounted(async () => {
  rememberContext.value =
    (await store.getFromChromeStorage(ChromeStorageKeys.REMEMBER_CONTEXT)) === 'true';
  contextMaxNo.value =
    parseInt(await store.getFromChromeStorage(ChromeStorageKeys.CONTEXT_MAX_NO)) || 10;
});

const emits = defineEmits(['updateRememberContext']);
const store = appStore();

const dialog = ref(false);
const rememberContext = ref(false);
const contextMaxNo = ref(10);

/**
 * Sets whether to remember previous context of the conversation.
 */
function flip() {
  rememberContext.value = !rememberContext.value;
  emits('updateRememberContext', rememberContext.value);
}

watch(rememberContext, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.REMEMBER_CONTEXT, newVal.toString());
});

watch(contextMaxNo, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.CONTEXT_MAX_NO, newVal.toString());
});
</script>

<template>
  <v-btn
    size="x-small"
    :prepend-icon="rememberContext ? 'mdi-play-outline' : 'mdi-stop-circle-outline'"
    rounded
    variant="outlined"
    color="primary"
    class="cy-openai-context-memorizer-modal-button"
    v-bind="props"
    @click="dialog = !dialog"
  >
    {{ rememberContext ? 'MEMORIZING...' : 'FORGETTING...' }}
  </v-btn>
  <v-dialog class="dialog" v-model="dialog" :scrim="false">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon> mdi-close </v-icon>
        </v-btn>
        <v-toolbar-title>Context Setting</v-toolbar-title>
      </v-toolbar>
      <v-container class="fill-height">
        <v-responsive class="fill-height pa-6">
          <div class="mb-4">
            <v-checkbox
              v-model="rememberContext"
              class="mb-4"
              @click="flip"
              label="Memorize Previous Contexts"
              color="primary"
              hide-details
            >
            </v-checkbox>
            <v-slider
              v-model="contextMaxNo"
              color="primary"
              :max="50"
              :step="1"
              thumb-label
              :ticks="{
                10: '',
                20: '',
                30: '',
                40: '',
                50: '',
              }"
              show-ticks="always"
            />
          </div>
          <v-card color="primary" variant="tonal">
            <v-card-item class="mt-2">
              <template v-slot:subtitle> Note </template>
            </v-card-item>
            <v-card-text class="text-medium-emphasis text-caption">
              If "Memorize Previous Contexts" is set, previous messages are also sent to OpenAI API
              with the current message. You can configure how many previous messages should be sent
              by using the slider.
            </v-card-text>
          </v-card>
        </v-responsive>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.cy-openai-context-memorizer-modal-button {
  margin-right: 8px;
}

.dialog {
  width: 80%;
}
</style>
