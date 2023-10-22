<script setup lang="ts">
import { ref } from "vue";
import { VForm, VTextarea } from "vuetify/components";
import { Template } from "@/common/templates";
import { appStore } from "@/store/app";
import { eventBus, EventName } from "@/common/event";

const store = appStore();
const selectedCustomTemplateId = ref<number | undefined>(undefined);
const dialog = ref(false);
const templateName = ref("");
const templateExample = ref("");
const template = ref("");
const formRef = ref<VForm | undefined>(undefined);
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

  resetForm()
}

async function deleteTemplate() {
  if (typeof selectedCustomTemplateId.value === "number") {
    await store.deleteCustomTemplate(selectedCustomTemplateId.value);
  }
  resetForm()
}

function resetForm() {
  selectedCustomTemplateId.value = undefined
  templateName.value = ""
  templateExample.value = ""
  template.value = ""
  formRef.value!.reset()
}
function onCustomTemplateChange(value: number) {
  const selectedTemplate = store.customTemplates.find(template => template.id === value);
  if (selectedTemplate) {
    templateName.value = selectedTemplate.name;
    templateExample.value = selectedTemplate.example;
    template.value = selectedTemplate.template;
  }
}
</script>

<template>
  <v-btn size="x-small"
         prepend-icon="mdi-text-long"
         rounded
         variant="outlined"
         color="primary"
         @click="dialog = !dialog">
    Add Template
    <v-dialog class="dialog"
              v-model="dialog"
              :scrim="false">
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
            <v-form ref="formRef"
                    @submit.prevent>
              <v-autocomplete v-model="selectedCustomTemplateId"
                              :items="store.customTemplates"
                              clearable
                              item-title="name"
                              item-value="id"
                              label="Saved Templates"
                              no-data-text="No custom templates found"
                              @update:modelValue="onCustomTemplateChange" />
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
            </v-form>

            <div class="d-flex justify-end">
              <v-btn size="x-small"
                     @click="saveTemplate"
                     prepend-icon="mdi-account-outline"
                     rounded
                     variant="outlined"
                     color="primary">
                Save
              </v-btn>
              <v-btn v-if="!!selectedCustomTemplateId"
                     class="ml-2"
                     size="x-small"
                     @click="deleteTemplate"
                     prepend-icon="mdi-account-outline"
                     rounded
                     variant="outlined"
                     color="primary">
                Delete
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
