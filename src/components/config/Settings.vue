<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { eventBus, EventName } from "@/common/event";
import { VTextField } from "vuetify/components";
import { appStore } from "@/store/app";

const dialog = ref(false);
const apiKey = ref("");
const store = appStore();
const showApiKey = ref(false);

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
        <v-container>
          <v-responsive>
            <v-text-field
              v-model="apiKey"
              :type="showApiKey ? 'text' : 'password'"
              clearable
              :append-inner-icon="showApiKey ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showApiKey = !showApiKey"
              :rules="[value => (value && value.length > 0) ? true : 'Set your OpenAI API key.']"
              messages="Set your OpenAI API key. Visit https://platform.openai.com/account/api-keys to get your API key."
              label="API Key" />
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style>

</style>
