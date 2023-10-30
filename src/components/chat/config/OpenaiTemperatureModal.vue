<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ChromeStorageKeys } from '@/common/keys';
import { appStore } from '@/store/app';

const props = defineProps({
  customStyle: {
    type: String,
    default: null,
  },
  selectedTemperature: {
    type: Number,
    required: true,
    default: 1.0,
  },
});

onMounted(async () => {
  temperature.value =
    parseFloat(await store.getFromChromeStorage(ChromeStorageKeys.TEMPERATURE)) || 1.0;
});

const emits = defineEmits(['updateOpenaiTemperature']);

const store = appStore();
const dialog = ref(false);

const temperature = ref(1.0);

watch(temperature, (newVal) => {
  store.saveToChromeStorage(ChromeStorageKeys.TEMPERATURE, newVal.toString());
  emits('updateOpenaiTemperature', newVal);
});
</script>

<template>
  <v-btn
    size="x-small"
    prepend-icon="mdi-thermometer-low"
    rounded
    variant="outlined"
    color="primary"
    :class="customStyle"
    v-bind="props"
    @click="dialog = !dialog"
  >
    Temperature
    <v-dialog class="dialog" v-model="dialog" :scrim="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <v-toolbar-title>Temperature</v-toolbar-title>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height pa-6">
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
                    <v-icon class="ml-1" color="primary"> mdi-thermometer </v-icon>
                  </div>
                </template>
              </v-slider>
            </div>
            <v-card color="primary" variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle> Note </template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                Configure temperature which should be between 0 and 2. Higher values like 0.8 will
                make the output more random, while lower values like 0.2 will make it more focused
                and deterministic.
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style scoped>
.slider {
  font-size: 10px;
}

.temperature {
  padding-top: 16px;
}

.temperature ::v-deep(.v-input--horizontal .v-input__append) {
  margin-inline-start: 4px !important;
}
</style>
