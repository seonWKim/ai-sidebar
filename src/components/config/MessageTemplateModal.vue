<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { VTextarea } from "vuetify/components";
import { appStore } from "@/store/app";
import { ChromeStorageKeys } from "@/common/keys";

const props = defineProps({
  customStyle: {
    type: String,
    default: null
  }
});

onMounted(async () => {
  store.getFromChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE)
    .then(result => {
      console.log("result: ", result);
      template.value = result;
    });
});

const emits = defineEmits(["updateMessageTemplate"]);

const store = appStore();
const dialog = ref(false);
const template = ref("");
const messageTemplateInputPlaceholder = "{{message}}";
const messageTemplatePlaceholder = `Summarize the following text: ${messageTemplateInputPlaceholder}`;

watch(template, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.MESSAGE_TEMPLATE, newVal);
  emits("updateMessageTemplate", newVal);
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
              class="mb-6"
              variant="outlined"
              shaped
              clearable
              flat
              hide-details
            />
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
