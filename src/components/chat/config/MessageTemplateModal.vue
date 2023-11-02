<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { VTextarea } from 'vuetify/components';
import { appStore } from '@/store/app';
import { ChromeStorageKeys } from '@/common/keys';
import { messageTemplateInputPlaceholder, defaultTemplates } from '@/common/templates';
import MessageTemplateAddModal from '@/components/chat/config/MessageTemplateAddModal.vue';

onMounted(async () => {
  template.value = await store.getFromChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE);
  showMessageTemplate.value =
    (await store.getFromChromeStorage(ChromeStorageKeys.SHOW_MESSAGE_TEMPLATE)) === 'true';
  await store.initializeCustomTemplates();
});

const emits = defineEmits(['updateMessageTemplate', 'updateShowMessageTemplate']);

const store = appStore();
const dialog = ref(false);
const template = ref('');
const messageTemplatePlaceholder = `Summarize the following text: ${messageTemplateInputPlaceholder}`;
const showMessageTemplate = ref(false);
const selectedTemplateHint = ref<string | undefined>('');
const selectedDefaultTemplate = ref<number | undefined>(undefined);
const selectedCustomTemplate = ref<number | undefined>(undefined);

watch(template, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE, newVal);
  emits('updateMessageTemplate', newVal);
});

watch(showMessageTemplate, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.SHOW_MESSAGE_TEMPLATE, newVal.toString());
  emits('updateShowMessageTemplate', newVal);
});

function onDefaultTemplateChange(value: number) {
  selectedCustomTemplate.value = undefined;
  template.value = defaultTemplates.find((template) => template.id === value)?.template || '';
  selectedTemplateHint.value = defaultTemplates.find((template) => template.id === value)?.example;
}

function onCustomTemplateChange(value: number) {
  selectedDefaultTemplate.value = undefined;
  template.value = store.customTemplates.find((template) => template.id === value)?.template || '';
  selectedTemplateHint.value = store.customTemplates.find((template) => template.id === value)
    ?.example;
}
</script>

<template>
  <v-btn
    size="x-small"
    prepend-icon="mdi-account-outline"
    rounded
    variant="outlined"
    color="primary"
    class="cy-message-template-modal-button"
    @click="dialog = !dialog"
  >
    TEMPLATE
    <v-dialog class="dialog" v-model="dialog" :scrim="false">
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon class="cy-message-template-modal-close-icon"> mdi-close </v-icon>
          </v-btn>
          <v-toolbar-title>Template</v-toolbar-title>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height pa-6">
            <message-template-add-modal class="mb-4" />
            <v-autocomplete
              v-model="selectedDefaultTemplate"
              :items="defaultTemplates"
              class="cy-message-template-modal-default-template"
              clearable
              item-title="name"
              item-value="id"
              label="Example Templates"
              no-data-text="No example templates found"
              @update:modelValue="onDefaultTemplateChange"
            />
            <v-autocomplete
              v-model="selectedCustomTemplate"
              :items="store.customTemplates"
              clearable
              item-title="name"
              item-value="id"
              label="Custom Templates"
              no-data-text="No custom templates found"
              @update:modelValue="onCustomTemplateChange"
            />
            <div v-if="!!selectedTemplateHint" class="selectedTemplateExample">
              Example:
              {{ selectedTemplateHint }}
            </div>
            <v-textarea
              class="cy-message-template-modal-textarea"
              v-model="template"
              :placeholder="messageTemplatePlaceholder"
              variant="outlined"
              shaped
              flat
              hide-details
            />

            <v-checkbox
              v-model="showMessageTemplate"
              class="cy-message-template-modal-show-checkbox"
              @click="showMessageTemplate != showMessageTemplate"
              label="Show message template"
              color="primary"
              hide-details
            />
            <v-card color="primary" variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle> Note</template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                <span>{{ messageTemplateInputPlaceholder }}</span>
                is a placeholder for the original message. Original message is formatted by using
                the template if configured. By default, the original message is added at the end.
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style scoped>
.cy-message-template-modal-button {
  margin-right: 8px;
}

.cy-message-template-modal-textarea {
  margin-bottom: 16px;
}

.cy-message-template-modal-show-checkbox {
  margin-bottom: 16px;
}

.dialog {
  width: 80%;
}

.selectedTemplateExample {
  padding: 4px 4px;
  font-size: 12px;
  letter-spacing: 0.03em;
  text-align: left;
}
</style>
