<script setup lang="ts">

import { ref } from "vue";
import { EventName, documentEventListener } from "@/common/event";

const tab = ref(0);
const tabs = ["Description", "Features", "Links"];
const startUsing = "Press the Free Ai Sidebar icon on the top right corner of your browser."

function toGithub() {
  window.open("https://github.com/seonwoo960000/ai-sidebar", "_blank");
}

function toChromeStore() {
  window.open("https://chromewebstore.google.com/detail/free-ai-side-bar/bphjdepgpbodffelhponjdfpjdajghgc?hl=ko", "_blank");
}

function scrollTo(tab: string) {
  document.getElementById(tab.toLowerCase())?.scrollIntoView({ behavior: "smooth" })
}

function openSidePanel() {
  documentEventListener.emitEvent(EventName.OPEN_SIDEPANEL)
}
</script>

<template>
  <v-container class="background" fluid>
    <v-row class="box-1">
      <v-col cols="12">
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
                   @click="scrollTo(tab)"
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
      </v-col>
      <v-col cols="12"
             id="description">
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
                       @click="openSidePanel"
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
      </v-col>
      <v-col cols="12">
        <span class="theme-images">
        <v-img class="theme-image"
               src="@/assets/example-themes.png"
               height="600" />
      </span>
      </v-col>
    </v-row>
    <v-row class="box-2"
           id="features">
      <v-col class="theme-left-column"
             cols="7">
        <v-img class="theme-image"
               src="@/assets/example-message-template.png"
               max-width="640" />
      </v-col>
      <v-col class="template-right-column"
             cols="5">
        <div>
          <div class="template-title">
            Configure your template
          </div>
          <div class="template-description">
            You can set your default message template so that you don't have to repeat the same message over and
            over again!!
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="box-3">
      <v-col class="memorization-left-column"
             cols="5">
        <div style="max-width: 420px">
          <div class="memorization-title">
            Remember the context
          </div>
          <div class="memorization-description">
            Remember context so that you can seamlessly continue your conversation with chatGPT.
          </div>
        </div>
      </v-col>
      <v-col class="memorization-right-column"
             cols="7">
        <v-img class="theme-image"
               src="@/assets/example-memorization.png"
               max-width="640" />
      </v-col>
    </v-row>
    <v-row class="box-4"
           id="links">
      <div class="mx-auto">
        <div class="footer-title">Links</div>
        <div class="footer-item"
             @click="toGithub">
          <v-icon>
            mdi-github
          </v-icon>
          Github
        </div>
        <div class="footer-item"
             @click="toChromeStore">
          <v-icon>
            mdi-google-chrome
          </v-icon>
          Chrome Extension
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped>
.background {
  font-family: sans-serif;
  padding: 16px 32px 16px 32px;
}

.box-1 {
  border-radius: 0.8rem;
  margin-bottom: 16px;
  padding: 24px 0 48px 0;
  background-image: linear-gradient(to bottom right, #FBD7FF 10%, #FFDEC1 80%);
}

.box-2 {
  border-radius: 0.8rem;
  margin-bottom: 16px;
  padding: 96px 0;
  background-color: #F4F4F4;
}

.box-3 {
  border-radius: 0.8rem;
  margin-bottom: 16px;
  padding: 96px 0;
  background-image: linear-gradient(to bottom right, #FBD7FF 10%, #FFDEC1 80%);
}

.box-4 {
  border-radius: 0.8rem;
  padding: 24px 0;
  background-color: #000000;
  display: flex;
  justify-content: center;
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

.theme-images {
  background-color: transparent;
  border-radius: 1rem;
}

.theme-image {
  background-color: transparent;
  border-radius: 1rem;
}

.theme-left-column {
  display: flex;
  justify-content: end;
}

.template-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.template-description {
  color: #555555;
  font-size: 16px;
}

.template-right-column {
  max-width: 420px;
  padding-right: 8px
}

.memorization-left-column {
  display: flex;
  justify-content: end;
}

.memorization-right-column {
}

.memorization-title {
  padding-right: 0;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.memorization-description {
  color: #555555;
  font-size: 16px;
}

.footer-title {
  color: #FFFFFF;
  font-weight: bold;
  margin-bottom: 16px;
}

.footer-item {
  cursor: pointer;
  margin-bottom: 12px;
  color: #727272;
  font-size: 0.8rem;
}
</style>
