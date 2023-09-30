<template>
  <div class="sidepanel-layout">
    <chat />
    <settings class="settings"/>
  </div>
</template>

<script lang="ts" setup>
import Chat from "@/components/Chat.vue";
import Settings from "@/components/config/Settings.vue";
</script>

<style scoped>
.sidepanel-layout {
  display: grid;
  grid-template-columns: 1fr 32px;
  height: 100vh;
}

.settings {
  background-color: #F0F1F5;
}
</style>
