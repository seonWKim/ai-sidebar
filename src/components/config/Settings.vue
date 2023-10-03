<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { eventBus, EventName } from "@/common/event";
import { VTextField } from "vuetify/components";
import { appStore } from "@/store/app";
import OpenaiApiKeyGuide from "@/components/config/OpenaiApiKeyGuide.vue";

const dialog = ref(false);
const apiKey = ref("");
const store = appStore();
const showApiKey = ref(false);
const openaiApiKeyGuideDialog = ref(false);

eventBus.on(EventName.OPEN_SETTINGS, () => {
  dialog.value = true;
});

onMounted(async () => {
  await store.initializeOpenAi();
  apiKey.value = store.openaiReadOny?.apiKey || "";
});

watch(apiKey, (newValue, oldValue) => {
  store.setOpenAiKey(newValue);
});

function updateOpenaiApiKeyGuideDialog(value: boolean) {
  openaiApiKeyGuideDialog.value = value;
}

</script>

<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="scroll-x-reverse-transition"
    >
      <template v-slot:activator="{ props }">
        <div class="text-center ma-4">
          <v-btn
            icon="mdi-cog"
            dark
            size="16px"
            v-bind="props"
            variant="flat"
          />
        </div>
      </template>
      <openai-api-key-guide hidden
                            :dialog="openaiApiKeyGuideDialog"
                            @update:dialog="updateOpenaiApiKeyGuideDialog" />
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              size="small"
              variant="text"
              disabled
            >
              Auto Saved
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height">
            <v-card class="mx-auto pa-12 pb-8"
                    density="compact"
                    elevation="8"
                    max-width="660"
                    rounded="lg">
              <div class="text-subtitle-1 text-medium-emphasis mb-2">
                OpenAI API Key
              </div>

              <v-text-field
                class="mb-4"
                density="compact"
                placeholder="API Key"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="apiKey"
                :type="showApiKey ? 'text' : 'password'"
                clearable
                :append-inner-icon="showApiKey ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showApiKey = !showApiKey"
                :rules="[value => (value && value.length > 0) ? true : 'Set your OpenAI API key.']" />
              <v-card class="mb-6"
                      color="primary"
                      variant="tonal">
                <v-card-item class="mt-2">
                  <template v-slot:subtitle>
                    Note
                  </template>
                </v-card-item>
                <v-card-text class="text-medium-emphasis text-caption">
                  Click
                  <span class="text-primary guide"
                        @click="openaiApiKeyGuideDialog = true">
                    OpenAi API Key Guide
                  </span>
                  for more information.
                </v-card-text>
              </v-card>
            </v-card>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.guide {
  cursor: pointer;
}
</style>
