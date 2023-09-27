<script setup lang="ts" xmlns:chat-message-received="http://www.w3.org/1999/XSL/Transform">
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { OpenaiMessage, OpenaiModel, OpenaiPrompt, OpenaiRole, streamOpenAiResponse } from "@/service/openai";
import { VTextarea } from "vuetify/components";
import type { Message } from "@/common/message";
import { eventBus, EventName } from "@/common/event";
import ChatMessage from "@/components/ChatMessage.vue";

const messages = ref<Message[]>([]);
const newMessage = ref("");
let received: Ref<Message> = getReceived();
const scrollTarget: Ref<any> = ref();

function getReceived(): Ref<Message> {
  return ref<Message>({
    id: uuidv4(),
    type: "received",
    text: []
  });
}

async function sendMessage(event: any) {
  if (event.key === "Enter" && event.shiftKey) {
    return;
  }

  if (newMessage.value.trim() !== "") {
    const message: Message = {
      id: uuidv4(),
      type: "sent",
      text: [newMessage.value]
    };
    messages.value.push(message);
    newMessage.value = "";

    let messagePushed = false;
    const prompt = new OpenaiPrompt(
      [new OpenaiMessage(OpenaiRole.SYSTEM, message.text.join(""))],
      OpenaiModel.gpt_3_5_turbo
    );
    await streamOpenAiResponse(prompt, res => {
        if (!messagePushed) {
          messages.value.push(received.value);
          messagePushed = true;
        }

        received.value.text.push(res);
        scrollTarget?.value?.scrollIntoView();
      },
      () => {
        received = getReceived();
      },
      onApiKeyError);
  }
}

function getPosition(message: Message) {
  return {
    "left-card": message.type === "sent",
    "right-card": message.type === "received"
  };
}

function getMessageCardClass(type: string) {
  return {
    "message-card": true,
    "message-card-sent": type === "sent",
    "message-card-received": type === "received"
  };
}

function onApiKeyError(err: string) {
  eventBus.emit(EventName.OPEN_SETTINGS, { "err": err });
}

</script>

<template>
  <div class="layout">
    <div class="top-top-layout">
      <div class="top-layout">
        <div>
          <div v-for="message in messages"
               :key="message.id"
               :class="getPosition(message)">
            <chat-message :message="message"
                          :class="getMessageCardClass(message.type)" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-layout">
      <v-textarea v-model="newMessage"
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
                  ref="scrollTarget" />
    </div>
  </div>
</template>


<style scoped>
.layout {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: relative;
}

.top-layout {
  margin: 0 0 16px 0;
  overflow-y: auto;

  flex-grow: 1;
  top: 0;
}

.bottom-layout {
  height: 124px;
  display: flex;

  bottom: 0;
}

.message-card {
  background-color: #F0F1F5;
  margin-bottom: 10px;
  width: 70%;
}

.left-card {
  display: flex;
  justify-content: flex-end;
}

.right-card {
  display: flex;
  justify-content: flex-start;
}

.message-card-sent {
  border-radius: 10px 0 10px 10px;
}

.message-card-received {
  border-radius: 0 10px 10px 10px;
}

.send-button {
  margin: 0 16px;
  height: 100%;
  border-radius: 20px;
}

*, ::before, ::after {
  background-repeat: no-repeat;
  box-sizing: initial;
}

</style>
