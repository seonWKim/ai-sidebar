<script
  setup
  lang="ts"
  xmlns:chat-message-received="http://www.w3.org/1999/XSL/Transform"
>
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  ListenerEvent,
  ListenerEventType,
  OpenaiMessage,
  OpenaiModel,
  OpenaiPrompt,
  OpenaiRole,
  streamOpenAiResponse,
} from "@/service/openai";
import { VBtn, VTextarea } from "vuetify/components";
import type { Message } from "@/common/message";
import { eventBus, EventName } from "@/common/event";
import ChatMessage from "@/components/ChatMessage.vue";
import OpenaiModelSelector from "@/components/config/OpenaiModelSelector.vue";
import OpenaiRoleSelector from "@/components/config/OpenaiRoleSelector.vue";

const messages = ref<Message[]>([]);
const newMessage = ref("");
const scrollTarget: Ref<any> = ref();
const textarea: Ref<any> = ref();
let received: Ref<Message> = getReceived();
const isMessageBeingStreamed = ref(false);
const selectedModel: Ref<OpenaiModel> = ref(OpenaiModel["gpt-3.5-turbo"]);
const selectedRole: Ref<OpenaiRole> = ref(OpenaiRole.system);

function getReceived(): Ref<Message> {
  return ref<Message>({
    id: uuidv4(),
    type: "received",
    text: [],
    canceled: false,
  });
}

function updateOpenaiModel(model: OpenaiModel) {
  selectedModel.value = model;
}

function updateOpenaiRole(role: OpenaiRole) {
  selectedRole.value = role;
}

async function sendMessage(event: any) {
  if (event.key === "Enter") {
    // Prevent sendMessage function from being called when shift key is pressed with enter
    if (event.shiftKey) {
      return;
    }

    // Prevent new line being inserted after enter key is pressed
    event.preventDefault();
  }

  // Return if message to send is empty
  if (newMessage.value.trim() === "") {
    return;
  }

  // Construct message to send
  const messageToSend: Message = {
    id: uuidv4(),
    type: "sent",
    text: [newMessage.value],
    canceled: false,
  };
  messages.value.push(messageToSend);
  newMessage.value = "";
  const prompt = new OpenaiPrompt(
    [new OpenaiMessage(selectedRole.value, messageToSend.text.join(""))],
    selectedModel.value
  );

  // Send message and receive stream response
  let isMessagePushed = false;
  await streamOpenAiResponse(
    prompt,
    (res) => {
      if (!isMessagePushed) {
        // Show received message in the UI
        messages.value.push(received.value);
        isMessagePushed = true;
      }

      received.value.text.push(res);
      scrollTarget.value.scrollIntoView();
    },
    () => {
      isMessageBeingStreamed.value = true;
      return null;
    },
    () => {
      if (received.value.canceled) {
        return new ListenerEvent(ListenerEventType.STOP_STREAM, "");
      }

      return null;
    },
    () => {
      received = getReceived();
      isMessageBeingStreamed.value = false;
      return null;
    },
    onApiKeyError
  );
}

function stopStream() {
  const streamingMessage = messages.value[messages.value.length - 1];
  if (streamingMessage.type === "received" && !streamingMessage.canceled) {
    streamingMessage.canceled = true;
  }
}

function getPosition(message: Message) {
  return {
    display: "flex",
    "justify-content": message.type === "sent" ? "flex-end" : "flex-start",
  };
}

function getMessageCardClass(type: string) {
  return {
    "message-card": true,
    "message-card-sent": type === "sent",
    "message-card-received": type === "received",
  };
}

function onApiKeyError(err: string) {
  eventBus.emit(EventName.OPEN_SETTINGS, { err: err });
  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: "API key is invalid",
    color: "error",
  });
}
</script>

<template>
  <div class="parent">
    <div class="chat-message-container">
      <div class="chat-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :style="getPosition(message)"
        >
          <chat-message
            :message="message"
            color="grey"
            :class="getMessageCardClass(message.type)"
          />
        </div>
      </div>
      <div ref="scrollTarget" />
      <div class="chat-message-buttons">
        <v-btn
          v-if="isMessageBeingStreamed"
          size="small"
          icon="mdi-stop"
          variant="plain"
          color="error"
          class="font-weight-bold"
          @click="stopStream"
        >
          Stop
        </v-btn>
      </div>
    </div>
    <div class="chat-textarea">
      <div class="selectbox-area">
        <openai-model-selector
          :selected-model="selectedModel"
          custom-style="mr-2"
          @update-openai-model="updateOpenaiModel"
        />
        <openai-role-selector
          :selected-role="selectedRole"
          custom-style="mr-2"
          @update-openai-role="updateOpenaiRole"
        />
      </div>
      <v-textarea
        v-model="newMessage"
        class="textarea"
        label="Write a message"
        @keydown.enter="sendMessage"
        append-inner-icon="mdi-send"
        :on-click:append-inner="sendMessage"
        variant="outlined"
        shaped
        clearable
        flat
        hide-details
        :disabled="isMessageBeingStreamed"
        ref="textarea"
      />
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-rows: 1fr 210px;
  grid-gap: 10px;
  height: 100%;

  overflow-y: auto;
  position: relative;
}

.chat-message-container {
  display: grid;
  grid-template-rows: 1fr 32px;
  margin: 0 8px;
  border-top: 2px solid #f0f1f5;
  border-bottom: 2px solid #f0f1f5;

  overflow-y: auto;
}

.chat-messages {
  padding: 16px;
}

.chat-message-buttons {
  position: absolute;
  bottom: 220px;
  left: 50%;
}

.chat-textarea {
  margin: 0 24px 0 8px;

  display: grid;
  grid-template-rows: 32px 1fr;
  grid-gap: 10px;
}

.selectbox-area {
  display: flex;
  align-items: center;
}

.message-card {
  margin-bottom: 10px;
  max-width: 70%;
}

.message-card-sent {
  border-radius: 10px 0 10px 10px;
}

.message-card-received {
  border-radius: 0 10px 10px 10px;
}
</style>
