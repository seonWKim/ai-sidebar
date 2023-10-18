<script setup lang="ts">

import { computed } from "vue";

const emits = defineEmits(["updateOpenaiTemperature"]);
const props = defineProps({
  selectedTemperature: {
    type: Number,
    required: true,
    default: 1.0
  }
});
const temperature = computed({
  get() {
    return props.selectedTemperature;
  },
  set(value: number) {
    emits("updateOpenaiTemperature", parseFloat(value.toFixed(1)));
  }
});

const description = "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.";
</script>

<template>
  <div>
    <v-slider
      class="slider"
      max="2"
      min="0"
      v-model="temperature"
      color="primary"
      thumb-size="10"
      track-size="2"
      :hint="temperature.toString()"
      :ticks="{ 0: '', 1: '', 2: ''}"
      show-ticks="always">
      <template v-slot:append>
        <div>
          <v-icon class="ml-1"
                  color="primary">
            mdi-thermometer
          </v-icon>
          <v-tooltip
            class="tooltip"
            width="400"
            activator="parent"
            location="left">
            {{ description }}
          </v-tooltip>
        </div>
      </template>
    </v-slider>
  </div>
</template>

<style scoped>
.slider {
  font-size: 10px;
}
</style>
