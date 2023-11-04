<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ChromeStorageKeys } from '@/common/keys';
import { appStore } from '@/store/app';
import { OpenaiImageSize } from '@/service/openai';

onMounted(async () => {
  const imageCountStr: string = await store.getFromChromeStorage(
    ChromeStorageKeys.IMAGE_CONFIGURATION_COUNT
  );
  const imageSizeStr: string = await store.getFromChromeStorage(
    ChromeStorageKeys.IMAGE_CONFIGURATION_SIZE
  );
  imageCount.value = imageCountStr ? imageCountStr : '1';
  imageSize.value = imageSizeStr
    ? OpenaiImageSize[imageSizeStr as keyof typeof OpenaiImageSize]
    : OpenaiImageSize.SMALL;
});

const emits = defineEmits(['updateImageCount', 'updateImageSize']);

const store = appStore();
const dialog = ref<boolean>(false);

const imageCount = ref<string>('1');
const imageSize = ref<OpenaiImageSize>(OpenaiImageSize.SMALL);

const imageSizes: OpenaiImageSize[] = [
  OpenaiImageSize.SMALL,
  OpenaiImageSize.MEDIUM,
  OpenaiImageSize.LARGE,
];

watch(imageCount, (newVal: string) => {
  store.saveToChromeStorage(ChromeStorageKeys.IMAGE_CONFIGURATION_COUNT, newVal.toString());
  emits('updateImageCount', parseInt(newVal));
});

watch(imageSize, (newVal: OpenaiImageSize) => {
  store.saveToChromeStorage(ChromeStorageKeys.IMAGE_CONFIGURATION_COUNT, newVal.toString());
  emits('updateImageSize', newVal);
});

function updateImageSize(selectedImageSize: OpenaiImageSize) {
  imageSize.value = selectedImageSize;
}
</script>

<template>
  <v-btn
    size="x-small"
    prepend-icon="mdi-cog-outline"
    rounded
    variant="outlined"
    color="primary"
    class="cy-openai-image-configuration-modal-button"
    @click="dialog = !dialog"
  >
    SETTINGS
    <v-dialog class="dialog" v-model="dialog" :scrim="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Image Generation Settings</v-toolbar-title>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height pa-6">
            <v-text-field
              v-model="imageCount"
              label="Number of Images"
              placeholder="Number of Images"
              type="number"
              :rules="[(value) => (1 <= value && value <= 10) || 'Value must be between 1 and 10.']"
              min="1"
              max="10"
            />
            <v-autocomplete
              v-model="imageSize"
              :items="imageSizes"
              label="Image Sizes"
              no-data-text="Image Size Not Configured"
              @update:modelValue="updateImageSize"
            />
            <v-card color="primary" variant="tonal">
              <v-card-item class="mt-2">
                <template v-slot:subtitle>Note</template>
              </v-card-item>
              <v-card-text class="text-medium-emphasis text-caption">
                Configure the number of images and the size of each image you want to generate.
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style scoped>
.cy-openai-image-configuration-modal-button {
  margin-right: 8px;
}

.dialog {
  width: 80%;
}
</style>
