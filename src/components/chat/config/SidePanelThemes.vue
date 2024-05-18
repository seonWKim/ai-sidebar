<script setup lang="ts">
import { onMounted } from 'vue';
import { appStore } from '@/store/app';
import { useTheme } from 'vuetify';
import { ChromeStorageKeys } from '@/common/keys';

const store = appStore();
const theme = useTheme();

onMounted(async () => {
  const savedTheme = await store.getFromChromeStorage(ChromeStorageKeys.THEME);
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light';
  store.saveToChromeStorage(ChromeStorageKeys.THEME, theme.global.name.value);
}
</script>

<template>
  <v-icon @click="toggleTheme"> mdi-theme-light-dark </v-icon>
</template>

<style scoped></style>
