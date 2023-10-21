<template>
  <div class="sidepanel-layout">
    <chat />
    <div class="h-100 bg-settings">
      <settings />
      <themes />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Chat from "@/components/Chat.vue";
import Settings from "@/components/config/Settings.vue";
import Themes from "@/components/config/Themes.vue";
</script>

<style scoped>
.sidepanel-layout {
  display: grid;
  grid-template-columns: 1fr 36px;
  height: 100vh;
  overflow: hidden;
}

</style>
