<script setup lang="ts">
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  ListenerEvent,
  ListenerEventType,
  OpenaiMessage,
  OpenaiModel,
  OpenaiPrompt,
  OpenaiRole,
  streamOpenAiResponse
} from "@/service/openai";
import { VBtn, VTextarea } from "vuetify/components";
import type { Message } from "@/common/message";
import { eventBus, EventName } from "@/common/event";
import ChatMessage from "@/components/ChatMessage.vue";
import OpenaiModelSelector from "@/components/config/OpenaiModelSelector.vue";
import MessageTemplateModal from "@/components/config/MessageTemplateModal.vue";
import OpenaiTemperatureModal from "@/components/config/OpenaiTemperatureModal.vue";
import _ from "lodash";
import OpenaiContextMemorizerModal from "@/components/config/OpenaiContextMemorizerModal.vue";

const messageTemplate = ref("");
const showMessageTemplate = ref(false);
const messageTemplateInputPlaceholder = "{{message}}";
const scrollTarget: Ref<any> = ref();
const model = ref(null);

const messages = ref<Message[]>([]);
const newMessage = ref("");
const isMessageBeingStreamed = ref(false);
const selectedModel: Ref<OpenaiModel> = ref(OpenaiModel["gpt-3.5-turbo"]);
const selectedTemperature: Ref<number> = ref(1.0);

let messageContexts: OpenaiMessage[] = [];
const summarizeContextOpenaiMessage = OpenaiMessage.of1(
  "Summarize all the messages in a format as follows. The placeholder for previousContext is where you have to fill in." +
  "'Previous context: {{previousContext}}\n",
  OpenaiRole.user
);
const contextMaxNo: Ref<number> = ref(5);
const rememberContext: Ref<boolean> = ref(false);

function getReceived(): Ref<Message> {
  return ref<Message>({
    id: uuidv4(),
    role: OpenaiRole.system,
    type: "received",
    text: [],
    originalText: [],
    canceled: false
  });
}

/**
 * Update the {@link messageTemplate} which is used for formatting the original message typed by the user.
 * @param template Message template
 */
function updateMessageTemplate(template: string) {
  messageTemplate.value = template;
}

/**
 * Update {@link showMessageTemplate} which is used to determine whether to show message formatted with message template.
 * @param showMessage Whether to show message formatted with message template
 */
function updateShowMessageTemplate(showMessage: boolean) {
  showMessageTemplate.value = showMessage;
}

/**
 * Update the {@link selectedModel} to use.
 * @param model OpenAI model
 */
function updateOpenaiModel(model: OpenaiModel) {
  selectedModel.value = model;
}

/**
 * Update {@link rememberContext}
 * @param shouldRememberContext Whether to remember context or not
 */
function updateRememberContext(shouldRememberContext: boolean) {
  if (!shouldRememberContext) {
    messageContexts = [];
  }
  rememberContext.value = shouldRememberContext;
}

/**
 * Update the {@link selectedTemperature} of OpenAI API.
 * @param temperature Temperature
 */
function updateOpenaiTemperature(temperature: number) {
  selectedTemperature.value = temperature;
}

/**
 * Send message to OpenAI API and stream the response. The way it works is as follows:
 * <pre>
 *   1. Check whether the keyboard event is "pressing enter key" without "pressing shift key". If not, return.
 *   2. Push the user typed message into {@link messages} array. This array of messages are shown in the UI.
 *   3. Construct the prompt by using {@link constructMessage} function to send to OpenAI API.
 *   4. Stream the response from OpenAI API by using {@link streamOpenAiResponse} function.
 * </pre>
 * @param event Keyboard event
 */
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
    role: OpenaiRole.user,
    type: "sent",
    text: [constructMessage(messageTemplate.value, newMessage.value)],
    originalText: [newMessage.value],
    canceled: false
  };
  messages.value.push(messageToSend);
  newMessage.value = "";
  const prompt = new OpenaiPrompt(
    await constructOpenaiMessages(),
    selectedModel.value,
    selectedTemperature.value
  );

  // Send message and receive stream response
  let isMessagePushed = false;
  const received = getReceived();
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
      if (rememberContext.value) {
        addContext(OpenaiMessage.of1(received.value.text.join(""), OpenaiRole.system));
      }
      // received = getReceived();
      isMessageBeingStreamed.value = false;
      return null;
    },
    onApiKeyError
  );
}

/**
 * Stop streaming response.
 */
function stopStream() {
  const streamingMessage = messages.value[messages.value.length - 1];
  if (streamingMessage.type === "received" && !streamingMessage.canceled) {
    streamingMessage.canceled = true;
  }
}

/**
 * Clear all messages and contexts.
 */
function clearMessages() {
  messages.value = [];
  newMessage.value = "";
  messageContexts = [];
}

/**
 * Construct message to be sent to OpenAI API by combining the message template and the message if configured.
 * When message template is not configured, the original message is used without any modification.
 * @param template message template to be used to format the original message
 * @param message the original message which user typed in
 */
function constructMessage(template: string, message: string): string {
  if (!template || template.trim() === "") {
    return message;
  }

  if (template.includes(messageTemplateInputPlaceholder)) {
    return template.replace("{{message}}", message);
  } else {
    return template + "\n" + message;
  }
}

/**
 * Construct messages to be sent to OpenAI API
 * When {@link rememberContext} value is set to true, the context of the previous conversation will be sent to OpenAI API as well.
 * If the size of the previous context is too large, it will be summarized first.
 * @returns {Promise<OpenaiMessage[]>} messages to be sent to OpenAI API
 */
async function constructOpenaiMessages(): Promise<OpenaiMessage[]> {
  if (messages.value.length == 0) {
    return [];
  }

  const messageToBeSent = messages.value[messages.value.length - 1];
  if (!rememberContext.value) {
    return [OpenaiMessage.of1(messageToBeSent.text.join(""), OpenaiRole.user)];
  }

  // Summarize the context if it is too long
  if (messageContexts.length > contextMaxNo.value) {
    const prompt = new OpenaiPrompt(
      [...messageContexts, summarizeContextOpenaiMessage],
      selectedModel.value,
      selectedTemperature.value
    );

    const summarizedContext: string[] = [];
    await streamOpenAiResponse(
      prompt,
      (res) => {
        summarizedContext.push(res);
      }
    );
    messageContexts = [OpenaiMessage.of1(summarizedContext.join(""), OpenaiRole.system)];
  }

  addContext(OpenaiMessage.of1(messageToBeSent.text.join(""), OpenaiRole.user));
  return _.cloneDeep(messageContexts);
}

/**
 * Add context to {@link messageContexts}
 * @param context context to add
 */
function addContext(context: OpenaiMessage) {
  messageContexts.push(context);
}

function onApiKeyError(err: string) {
  eventBus.emit(EventName.OPEN_SETTINGS, { err: err });
  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: "API key is invalid",
    color: "error"
  });
}

function getPosition(message: Message) {
  return {
    display: "flex",
    "justify-content": message.type === "sent" ? "flex-end" : "flex-start"
  };
}

function getMessageCardClass(type: string) {
  return {
    "message-card": true,
    "message-card-sent": type === "sent",
    "message-card-received": type === "received"
  };
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
            :show-message-template="showMessageTemplate"
            color="messages"
            :class="getMessageCardClass(message.type)"
          />
        </div>
      </div>
      <div ref="scrollTarget" />
      <div class="chat-message-buttons">
        <v-btn
          v-if="isMessageBeingStreamed"
          size="small"
          variant="plain"
          color="error"
          class="font-weight-bold"
          @click="stopStream"
        >
          Stop
        </v-btn>
        <v-btn
          v-if="!isMessageBeingStreamed && messages.length > 0"
          size="small"
          variant="plain"
          color="error"
          class="font-weight-bold"
          @click="clearMessages">
          Clear
        </v-btn>
      </div>
    </div>
    <div class="chat-textarea">
      <div class="selectbox-area">
        <v-slide-group v-model="model"
                       show-arrows>
          <v-slide-group-item>
            <message-template-modal
              custom-style="mr-2"
              @update-message-template="updateMessageTemplate"
              @update-show-message-template="updateShowMessageTemplate" />
          </v-slide-group-item>
          <v-slide-group-item>
            <openai-context-memorizer-modal
              custom-style="mr-2"
              @update-remember-context="updateRememberContext" />
          </v-slide-group-item>
          <v-slide-group-item>
            <openai-model-selector
              :selected-model="selectedModel"
              custom-style="mr-2"
              @update-openai-model="updateOpenaiModel" />
          </v-slide-group-item>
          <v-slide-group-item>
            <openai-temperature-modal
              :selected-temperature="selectedTemperature"
              @update-openai-temperature="updateOpenaiTemperature" />
          </v-slide-group-item>
        </v-slide-group>
      </div>
      <v-textarea
        v-model="newMessage"
        class="main-textarea"
        label="Write a message"
        placeholder="Write an application that uses AI to..."
        @keydown.enter="sendMessage"
        append-inner-icon="mdi-send"
        :on-click:append-inner="sendMessage"
        variant="outlined"
        shaped
        clearable
        flat
        hide-details
        :disabled="isMessageBeingStreamed"
      />
    </div>
  </div>
</template>

<style scoped>
/* if you want to update the grid-template-rows, you need to update the .chat-message-buttons as well */
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
  border-bottom: 2px solid #F0F1F5;

  overflow-y: auto;
}

.chat-messages {
  padding: 16px;
}

/* because the size of the textbox is 210px from the bottom(refer to .parent), if can fix the position of the buttons by using absolute position */
.chat-message-buttons {
  position: absolute;
  width: 100%;
  bottom: 220px;
  display: flex;
  justify-content: center;
}

.chat-textarea {
  margin: 0 8px 0 8px;
  display: grid;
  grid-template-rows: 32px 1fr;
  grid-gap: 10px;
}

.selectbox-area {
  display: flex;
  align-items: center;
  width: 100%;
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

.main-textarea {

}

</style>
