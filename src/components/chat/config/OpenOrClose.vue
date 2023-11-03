<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { appStore } from '@/store/app';
import { ChromeStorageKeys } from '@/common/keys';

const store = appStore();
const showIcon = 'mdi-chevron-left';
const hideIcon = 'mdi-chevron-right';
const showSidePanel = ref(false);

const emits = defineEmits(['showOrHideSidePanel']);

onMounted(async () => {
  showSidePanel.value = await getShowSidePanel();
  emits('showOrHideSidePanel', showSidePanel.value);
});

async function getShowSidePanel(): Promise<boolean> {
  const showSidePanelStr = await store.getFromChromeStorage(ChromeStorageKeys.SHOW_SIDE_PANEL);
  return showSidePanelStr === 'true';
}

function flipShowSidePanelValue() {
  showSidePanel.value = !showSidePanel.value;
  store.saveToChromeStorage(ChromeStorageKeys.SHOW_SIDE_PANEL, showSidePanel.value.toString());
  emits('showOrHideSidePanel', showSidePanel.value);
}
</script>

<template>
  <v-icon @click="flipShowSidePanelValue" size="16px">
    {{ showSidePanel ? hideIcon : showIcon }}
  </v-icon>
</template>

<style scoped></style>
