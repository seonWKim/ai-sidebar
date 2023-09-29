<script setup lang="ts">

import { ref } from "vue";
import { eventBus, EventName } from "@/common/event";

const snackbar = ref(false);
const text = ref("");
const color = ref("primary");

eventBus.on(EventName.OPEN_SNACKBAR, message => {
    text.value = message?.text || "";
    color.value = message?.color || "primary";

    snackbar.value = true;
  }
);

</script>

<template>
  <div>
    <v-snackbar v-model="snackbar" :color="color" z-index="2500">
      {{ text }}
    </v-snackbar>
  </div>
</template>

<style scoped>

</style>
