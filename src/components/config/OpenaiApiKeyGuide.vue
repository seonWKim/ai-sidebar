<script setup lang="ts">

import { computed } from "vue";

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true,
    default: false
  }
});

const emits = defineEmits(["update:dialog"]);

const showDialog = computed({
  get() {
    return props.dialog;
  },
  set(value: boolean) {
    emits("update:dialog", value);
  }
});

const stepNameClass = "text-caption text-lg-body-1 mt-4 mb-2";
const stepDetailClass = "text-light-blue-accent-4 text-caption remove-anchor-default";
const imageBoxClass = "border-lg my-4";

</script>

<template>
  <div>
    <v-row justify="center">
      <v-dialog width="800"
                @click:outside="showDialog = false"
                v-model="showDialog">
        <v-card :variant="'elevated'">
          <v-card-item class="mx-15 my-10">
            <div class="text-h5 font-weight-bold my-2">
              Set OpenAI API Key 🔑
            </div>
            <div>
              <div :class="stepNameClass">Step 1: GET API Key</div>
              <ul class="ps-4 mb-6">
                <li>
                  <a :class="stepDetailClass"
                     href="https://platform.openai.com/login"
                     target="_blank">
                    Login to OpenAI account
                  </a>
                </li>
                <li>
                  <a :class="stepDetailClass"
                     href="https://platform.openai.com/account/api-keys"
                     target="_blank">
                    Visit OpenAI API Keys page
                  </a>
                </li>
              </ul>
              <div :class="imageBoxClass">
                <v-img
                  src="https://firebasestorage.googleapis.com/v0/b/ai-sidebar.appspot.com/o/api-key-guide.png?alt=media&token=2325df26-f137-4d26-a650-da224f301f86&_gl=1*1yue6sz*_ga*MTQyMjE5MzMwLjE2OTYxNzEzNDY.*_ga_CW55HF8NVT*MTY5NjE3MTM0Ni4xLjEuMTY5NjE3MTc5MC4xNi4wLjA."
                  alt="OpenAI API Key Guide Step 1"
                  min-width="600"
                  min-height="200">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
              <div :class="stepNameClass">
                Step 2: Paste API Key in OpenAi API Key input box
              </div>
              <div :class="imageBoxClass">
                <v-img
                  src="https://firebasestorage.googleapis.com/v0/b/ai-sidebar.appspot.com/o/Free%20SideBar%20for%20Open%20AI%202023-10-02%2008-48-24.png?alt=media&token=f6074108-1e4d-49a9-bbba-b6de4fd9d3f3&_gl=1*jep4zf*_ga*MTQyMjE5MzMwLjE2OTYxNzEzNDY.*_ga_CW55HF8NVT*MTY5NjIwMzgwNC4yLjEuMTY5NjIwNDEyNy41MC4wLjA."
                  alt="OpenAI API Key Guide Step 2"
                  min-width="600"
                  min-height="260">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style scoped>

</style>
