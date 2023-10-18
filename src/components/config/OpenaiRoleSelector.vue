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

/**
 * Select a role from the list of {@link OpenaiRole} values.
 * Used as a parameter for OpenAI API request.
 * @param roleStr OpenAi Role
 */
function selectRole(roleStr: string) {
  selectedRole.value = Object.values(OpenaiRole).find(key => OpenaiRole[key] === roleStr) || OpenaiRole.system;
  emits("updateOpenaiRole", selectedRole.value);
}

</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn size="x-small"
             prepend-icon="mdi-account-outline"
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
