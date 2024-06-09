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
});

watch(apiKey, (newValue, _) => {
  store.setOpenAiKey(newValue);
});

const shortCutKey = ref('');
const shortCutKeyHint = ref('');
const shortCutEnabled = ref(true);

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

function onShortCutKeyUpdate(value: string) {
  shortCutKey.value = value ? value : '';
  setShortCutKeyHint(shortCutKey.value);

  const customKey = shortCutKey.value ? shortCutKey.value : 'O';
  const customKeyMap = ['Control', 'Shift', customKey];
  store.saveToChromeStorage(
    ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS,
    JSON.stringify(customKeyMap)
  );
}

function onShortCutEnabledUpdate() {
  store.saveToChromeStorage(
    ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_ENABLED,
    shortCutEnabled.value.toString()
  );
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
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="scroll-x-reverse-transition">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props"> mdi-cog </v-icon>
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
<!--            TODO: For now, let's disable shortcut feature. We will enable it if needed-->
<!--            <div class="d-flex justify-space-between align-center">-->
<!--              <div class="text-subtitle-1 text-medium-emphasis mb-2">Open SideBar Short Cut</div>-->
<!--              <div>-->
<!--                <v-switch-->
<!--                  v-model="shortCutEnabled"-->
<!--                  color="primary"-->
<!--                  hide-details-->
<!--                  @update:modelValue="onShortCutEnabledUpdate"-->
<!--                  :label="shortCutEnabled ? 'On' : 'Off'"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="d-flex">-->
<!--              <v-text-field-->
<!--                class="defaultShortCutPrefixTextField"-->
<!--                density="compact"-->
<!--                placeholder="Control + Shift + "-->
<!--                prepend-inner-icon="mdi-keyboard-outline"-->
<!--                variant="outlined"-->
<!--                readonly-->
<!--              />-->
<!--              <v-text-field-->
<!--                class="customShortCutPostfixTextField"-->
<!--                v-model="shortCutKey"-->
<!--                density="compact"-->
<!--                placeholder="Custom Key"-->
<!--                variant="outlined"-->
<!--                @update:modelValue="onShortCutKeyUpdate"-->
<!--                :maxLength="1"-->
<!--                :hint="`${shortCutKeyHint}`"-->
<!--              />-->
<!--            </div>-->

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

            <v-card class="mb-6" color="primary" variant="tonal">
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
