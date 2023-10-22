<script setup lang="ts">
import { ref } from "vue";
import { VTextarea } from "vuetify/components";
import { Template } from "@/common/templates";
import { appStore } from "@/store/app";
import { eventBus, EventName } from "@/common/event";

const store = appStore();
const dialog = ref(false);
const templateName = ref("");
const templateExample = ref("");
const template = ref("");
async function saveTemplate() {
  const customTemplate: Template = {
    id: Date.now(),
    name: templateName.value,
    example: templateExample.value,
    template: template.value
  };
  await store.saveCustomTemplate(customTemplate);
  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: "New template saved!",
    color: "primary"
  });
}
</script>

<template>
  <v-btn size="x-small"
         prepend-icon="mdi-account-outline"
         rounded
         variant="outlined"
         color="primary"
         @click="dialog = !dialog">
    Add Template
    <v-dialog class="dialog"
              v-model="dialog"
              :scrim="false"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon
                 dark
                 @click="dialog=false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          <v-toolbar-title>Save Template</v-toolbar-title>
        </v-toolbar>
        <v-container class="fill-height">
          <v-responsive class="fill-height pa-6">
            <v-text-field
              class="mb-2"
              v-model="templateName"
              label="Template Name"
              placeholder="Linux Terminal"
              :rules="[v => !!v || 'Template name is required']"
            />
            <v-text-field
              class="mb-2"
              v-model="templateExample"
              label="Example"
              placeholder="pwd"
            />
            <v-textarea
              class="mb-2"
              v-model="template"
              :placeholder="'Act as a linux terminal. My first message is ' + '{{message}}'"
              variant="outlined"
              shaped
              flat
              :rules="[v => !!v || 'Template is required']"
            />

            <div class="d-flex justify-end">
              <v-btn size="x-small"
                     @click="saveTemplate"
                     prepend-icon="mdi-account-outline"
                     rounded
                     variant="outlined"
                     color="primary">
                Save
              </v-btn>
            </div>
          </v-responsive>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style scoped>

.dialog {
  width: 70%;
}

</style>
