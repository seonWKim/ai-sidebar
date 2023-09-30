<script setup lang="ts">
import { ref } from "vue";
import { OpenaiRole } from "@/service/openai";

const props = defineProps({
  selectedRole: {
    type: String,
    default: OpenaiRole.system
  },
  customStyle: {
    type: String,
    default: null
  }
});

const emits = defineEmits(["updateOpenaiRole"]);

const roles = ref(Object.values(OpenaiRole));
const selectedRole = ref(props.selectedRole);

function selectRole(roleStr: string) {
  const role =
    Object.values(OpenaiRole).find(key => OpenaiRole[key] === roleStr) ||
    OpenaiRole.system;

  selectedRole.value = role;
  emits("updateOpenaiRole", selectedRole.value);
}

</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn size="x-small"
             prepend-icon="mdi-brain"
             rounded
             variant="outlined"
             color="primary"
             :class="customStyle"
             v-bind="props"
      >
        {{ selectedRole }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(role, index) in roles"
        :key="index"
        @click="selectRole(role)">
        <v-list-item-title>{{ role }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>

</style>
