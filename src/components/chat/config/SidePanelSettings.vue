<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { eventBus, EventName } from '@/common/event';
import { VTextField } from 'vuetify/components';
import { appStore } from '@/store/app';
import OpenaiApiKeyGuide from '@/components/chat/config/OpenaiApiKeyGuide.vue';
import { ChromeStorageKeys } from '@/common/keys';

const dialog = ref(false);
const apiKey = ref('');
const store = appStore();
const showApiKey = ref(false);
const openaiApiKeyGuideDialog = ref(false);

eventBus.on(EventName.OPEN_SETTINGS, () => {
  dialog.value = true;
});

onMounted(async () => {
  await store.initializeOpenAi();
  apiKey.value = store.openaiReadOny?.apiKey || '';
  shortCutEnabled.value = await getOpenSidePanelEventTriggerEnabled();
  shortCutKey.value = (await getCustomOpenSidePanelEventTriggerKeyNames()).join('');
  setShortCutKeyHint(shortCutKey.value);

  temperature.value =
    parseFloat(await store.getFromChromeStorage(ChromeStorageKeys.TEMPERATURE)) ||
    store.openaiSettings.temperature;

  const rememberContextValue = await store.getFromChromeStorage(ChromeStorageKeys.REMEMBER_CONTEXT);
  if (rememberContextValue != null && rememberContextValue === 'false') {
    rememberContext.value = false;
  } else {
    rememberContext.value = true;
  }

  contextMaxNo.value =
    parseInt(await store.getFromChromeStorage(ChromeStorageKeys.CONTEXT_MAX_NO)) || 10;
});

const shortCutKey = ref('');
const shortCutKeyHint = ref('');
const shortCutEnabled = ref(true);
const temperature = ref(1.0);
const rememberContext = ref(true);
const contextMaxNo = ref(10);

watch(apiKey, (newValue, _) => {
  store.setOpenAiKey(newValue);
});
watch(temperature, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.TEMPERATURE, newVal.toString());
  store.updateTemperature(newVal);
});
watch(rememberContext, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.REMEMBER_CONTEXT, newVal.toString());
  store.updateRememberContext(newVal);
});
watch(contextMaxNo, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.CONTEXT_MAX_NO, newVal.toString());
  store.updateContextMaxNo(newVal);
});

async function getOpenSidePanelEventTriggerEnabled(): Promise<boolean> {
  const enabled = await store.getFromChromeStorage(
    ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_ENABLED
  );
  return enabled ? enabled === 'true' : false;
}

async function getCustomOpenSidePanelEventTriggerKeyNames(): Promise<string[]> {
  const openSidePanelEventTriggerKeysStr = await store.getFromChromeStorage(
    ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS
  );
  let openSidePanelEventTriggerKeyNames = ['Control', 'Shift', 'O'];
  if (openSidePanelEventTriggerKeysStr) {
    openSidePanelEventTriggerKeyNames = JSON.parse(openSidePanelEventTriggerKeysStr);
  }

  return openSidePanelEventTriggerKeyNames.slice(2);
}

function setShortCutKeyHint(value: string) {
  if (value) {
    shortCutKeyHint.value =
      'Control + Shift + ' + [...new Set(value)].map((c) => `${c.toUpperCase()}`).join(' + ');
  } else {
    shortCutKeyHint.value = '';
  }
}

function updateOpenaiApiKeyGuideDialog(value: boolean) {
  openaiApiKeyGuideDialog.value = value;
}

function flip() {
  rememberContext.value = !rememberContext.value;
}
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="scroll-x-reverse-transition">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props"> mdi-cog</v-icon>
    </template>
    <openai-api-key-guide
      hidden
      :dialog="openaiApiKeyGuideDialog"
      @update:dialog="updateOpenaiApiKeyGuideDialog"
    />
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn size="small" variant="text" disabled> Auto Saved</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container class="fill-height">
        <v-responsive class="fill-height">
          <v-form class="inner-container">
            <div class="text-subtitle-1 text-medium-emphasis mb-2">OpenAI API Key</div>
            <v-text-field
              density="compact"
              placeholder="API Key"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              v-model="apiKey"
              :type="showApiKey ? 'text' : 'password'"
              clearable
              autocomplete="on"
              :append-inner-icon="showApiKey ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showApiKey = !showApiKey"
              :rules="[(value) => (value && value.length > 0 ? true : 'Set your OpenAI API key.')]"
            />

            <v-card class="mb-10" color="primary" variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle> Note</template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                Click
                <span class="text-primary guide" @click="openaiApiKeyGuideDialog = true">
                  OpenAi API Key Guide
                </span>
                for more information.
              </v-card-text>
            </v-card>

            <div class="text-subtitle-1 text-medium-emphasis mb-2">Temperature</div>
            <div class="temperature">
              <v-slider
                class="slider"
                max="2"
                min="0"
                :step="0.1"
                v-model="temperature"
                color="primary"
                thumb-label
                :ticks="{
                  0: '',
                  1: '',
                  2: '',
                }"
                show-ticks="always"
              >
                <template v-slot:prepend>
                  <div>
                    <v-icon class="ml-1" color="primary"> mdi-thermometer</v-icon>
                  </div>
                </template>
              </v-slider>
            </div>
            <v-card class="mb-10" color="primary" variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle> Note</template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                Configure temperature which should be between 0 and 2. Higher values like 0.8 will
                make the output more random, while lower values like 0.2 will make it more focused
                and deterministic.
              </v-card-text>
            </v-card>

            <div>
              <v-checkbox
                v-model="rememberContext"
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
                <template v-slot:subtitle> Note</template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                If "Memorize Previous Contexts" is set, previous messages are also sent to OpenAI
                API with the current message. You can configure how many previous messages should be
                sent by using the slider.
              </v-card-text>
            </v-card>
          </v-form>
        </v-responsive>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.guide {
  cursor: pointer;
}

.inner-container {
  margin: auto;
  padding: 40px;
}

.defaultShortCutPrefixTextField {
  max-width: 180px;
  margin-right: 16px;
}

.customShortCutPostfixTextField {
}
</style>
