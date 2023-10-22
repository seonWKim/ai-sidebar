<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { VTextarea } from "vuetify/components";
import { appStore } from "@/store/app";
import { ChromeStorageKeys } from "@/common/keys";
import { messageTemplateInputPlaceholder } from "@/common/templates";

const props = defineProps({
  customStyle: {
    type: String,
    default: null
  }
});

onMounted(async () => {
  template.value = await store.getFromChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE)
  showMessageTemplate.value = await store.getFromChromeStorage(ChromeStorageKeys.SHOW_MESSAGE_TEMPLATE) === "true";
});

const emits = defineEmits(["updateMessageTemplate", "updateShowMessageTemplate"]);

const store = appStore();
const dialog = ref(false);
const template = ref("");
const messageTemplatePlaceholder = `Summarize the following text: ${messageTemplateInputPlaceholder}`;
const showMessageTemplate = ref(false);

watch(template, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE, newVal);
  emits("updateMessageTemplate", newVal);
});

watch(showMessageTemplate, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.SHOW_MESSAGE_TEMPLATE, newVal.toString());
  emits("updateShowMessageTemplate", newVal);
});

</script>

<template>
  <v-btn size="x-small"
         prepend-icon="mdi-account-outline"
         rounded
         variant="outlined"
         color="primary"
         :class="customStyle"
         v-bind="props"
         @click="dialog = !dialog">
    Template
    <v-dialog class="dialog"
              v-model="dialog"
              :scrim="false">
      <v-card>
        <v-toolbar dark
                   color="primary">
          <v-btn icon
                 dark
                 @click="dialog=false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          <v-toolbar-title>Template</v-toolbar-title>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height pa-6">
            <v-textarea
              v-model="template"
              :placeholder="messageTemplatePlaceholder"
              variant="outlined"
              shaped
              clearable
              flat
              hide-details
            />
            <v-checkbox
              v-model="showMessageTemplate"
              class="mb-4"
              @click="showMessageTemplate != showMessageTemplate"
              label="Show message template"
              color="primary"
              hide-details>
            </v-checkbox>
            <v-card color="primary"
                    variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle>
                  Note
                </template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                <span>{{ messageTemplateInputPlaceholder }}</span> is a placeholder for the original message.
                Original message is formatted by using the template if configured.
                By default, the original message is added at the end.
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style scoped>

.dialog {
  width: 80%;
}

</style>
