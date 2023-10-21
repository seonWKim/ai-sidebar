<script setup lang="ts">

import { ref } from "vue";

const tab = ref(0);
const tabs = ["Description", "Features", "Contact"];
const startUsing = "Press \"Command + Shift + O\" for Mac. " +
  "Press \"Ctrl + Shift + O\" for Windows.";

function toGithub() {
  window.open("https://github.com/seonwoo960000/ai-sidebar", "_blank");
}
</script>

<template>
  <v-container class="background" fluid>
    <div class="box-1">
      <v-card class="appbar" elevation="0">
        <div class="d-flex align-center pa-4 font-weight-bold">
          <v-img src="@/assets/logo.png"
                 alt="FREE AI Sidebar"
                 width="25px"
                 height="25px" />
          <span class="ml-4">FREE AI</span>
        </div>
        <v-tabs v-model="tab"
                align-tabs="center"
                bg-color="transparent">
          <v-tab v-for="tab in tabs"
                 class="tab text-capitalize mx-2"
                 hide-slider
                 :key="tab"
                 :value="tab">
            {{ tab }}
          </v-tab>
        </v-tabs>
        <div>
          <v-btn disabled>
            NO SIGN UP
          </v-btn>
        </div>
      </v-card>
      <div class="description text-center">
        <div class="description-1">
          Introducing Free AI Sidebar
        </div>
        <div class="description-2">
          AI Tools Made Free
        </div>
        <div class="description-3">
          Free AI Sidebar is a free and open source AI tool <br />
          which is available for everyone to use. <br />
        </div>
        <div>
          <v-tooltip :text="startUsing"
                     max-width="300px"
                     location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn class="description-button-1 text-capitalize"
                     size="large"
                     v-bind="props"
              >
                Start Using
              </v-btn>
            </template>
          </v-tooltip>
          <v-btn class="description-button-2 text-capitalize"
                 size="large"
                 @click="toGithub">
            <v-icon>
              mdi-github
            </v-icon>
            Github
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.background {
  font-family: sans-serif;
  padding: 16px 32px 16px 32px;
}

.box-1 {
  border-radius: 0.8rem;
  padding: 32px;
  background-image: linear-gradient(to bottom right, #FBD7FF 10%, #FFDEC1 80%);
}

.appbar {
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 150px 1fr 150px;
  justify-items: center;
  align-items: center;
  border-radius: 0.5rem;
}

.tab {
  font-size: 14px;
}

.description {
  padding: 96px 0 112px 0;
}

.description-1 {
  margin-bottom: 12px;
  color: #555555;
}

.description-2 {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.3;
}

.description-3 {
  margin: 12px 0 32px 0;
  font-size: 1.2rem;
  line-height: 1.6;
}

.description-button-1 {
  padding: 0 20px;
  margin: 0 12px;
  border-radius: 0.375rem;
  background-color: black;
  color: white;
}

.description-button-2 {
  padding: 0 20px;
  margin: 0 12px;
  border-radius: 0.375rem;
  background-color: rgba(0, 0, 0, 0.06);;
}
</style>
