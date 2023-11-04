<script lang="ts" setup>
import Chat from '@/components/chat/Chat.vue';
import Settings from '@/components/chat/config/Settings.vue';
import Themes from '@/components/chat/config/Themes.vue';
import OpenOrClose from '@/components/chat/config/OpenOrClose.vue';
import { ref } from 'vue';

const showSidePanel = ref(false);
const SHOW_STYLE = '1fr 36px 16px';
const HIDE_STYLE = '1fr 0px 16px';
const gridTemplateColumns = ref(HIDE_STYLE);

const sidePanelLayout = ref({
  display: 'grid',
  'grid-template-columns': gridTemplateColumns,
  height: '100vh',
  overflow: 'hidden',
});

function showOrHideSidePanel(value: boolean) {
  showSidePanel.value = value;
  gridTemplateColumns.value = showSidePanel.value ? SHOW_STYLE : HIDE_STYLE;
}
</script>

<template>
  <div :style="sidePanelLayout">
    <chat class="cy-chat" />
    <div class="icons bg-settings">
      <div v-show="showSidePanel">
        <div class="cy-settings">
          <settings />
        </div>
        <div class="cy-themes">
          <themes />
        </div>
      </div>
    </div>
    <div class="cy-show-or-hide bg-settings2">
      <open-or-close @show-or-hide-side-panel="showOrHideSidePanel" />
    </div>
  </div>
</template>

<style scoped>
.icons {
  position: relative;
}

.cy-settings {
  margin-top: 8px;
  text-align: center;
}

.cy-themes {
  margin-top: 8px;
  text-align: center;
}

.cy-show-or-hide {
  display: flex;
  align-items: center;
}
</style>
