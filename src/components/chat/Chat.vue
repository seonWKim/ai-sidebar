<script setup lang="ts">
import { Ref, ref, toRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {
  getOpenaiChatResponse,
  getOpenaiImageGenerationResponse,
  ListenerEvent,
  ListenerEventType,
  OpenaiChatMessage,
  OpenaiChatPrompt,
  OpenaiImageGenerationPrompt,
  OpenaiImageSize,
  OpenaiModel,
  OpenaiRole,
} from '@/service/openai';
import { VBtn, VTextarea } from 'vuetify/components';
import type { Message } from '@/common/message';
import { eventBus, EventName } from '@/common/event';
import ChatMessage from '@/components/chat/message/ChatMessage.vue';
import OpenaiModelSelector from '@/components/chat/config/OpenaiModelSelector.vue';
import MessageTemplateModal from '@/components/chat/config/MessageTemplateModal.vue';
import OpenaiTemperatureModal from '@/components/chat/config/OpenaiTemperatureModal.vue';
import _ from 'lodash';
import OpenaiContextMemorizerModal from '@/components/chat/config/OpenaiContextMemorizerModal.vue';
import { messageTemplateInputPlaceholder } from '@/common/templates';
import {
  ChatType,
  ChatTypeConfigButtonAvailability as availability,
  ConfigurationButtons as buttons,
} from '@/common/chat-type';
import ChatTypeSelector from '@/components/chat/config/ChatTypeSelector.vue';
import OpenaiImageConfigurationModal from '@/components/chat/config/OpenaiImageConfigurationModal.vue';

class ChatTypeInformation {
  placeholder: string;

  constructor(placeholder: string) {
    this.placeholder = placeholder;
  }
}

const chatTypeInformationMap: Record<ChatType, ChatTypeInformation> = {
  [ChatType.TEXT]: new ChatTypeInformation('Write a command ...'),
  [ChatType.IMAGE]: new ChatTypeInformation('Generate an image that...'),
};

const selectedChatType = ref<ChatType>(ChatType.TEXT);
const messageTemplate = ref('');
const showMessageTemplate = ref(false);
const scrollTarget: Ref<any> = ref();
const model = ref(null);

const messages = ref<Message[]>([]);
const newMessage = ref('');
const isMessageBeingStreamed = ref(false);
const selectedModel: Ref<OpenaiModel> = ref(OpenaiModel['gpt-3.5-turbo']);
const selectedTemperature: Ref<number> = ref(1.0);
const selectedImageCount = ref<number>(1);
const selectedImageSize = ref<OpenaiImageSize>(OpenaiImageSize.SMALL);

let messageContexts: OpenaiChatMessage[] = [];
const summarizeContextOpenaiMessage = OpenaiChatMessage.of1(
  'Summarize all the messages in a format as follows. The placeholder for previousContext is where you have to fill in.' +
    "'Previous context: {{previousContext}}\n",
  OpenaiRole.user
);
const contextMaxNo: Ref<number> = ref(5);
const rememberContext: Ref<boolean> = ref(false);

function getDefaultReceived(): Ref<Message> {
  return ref<Message>({
    id: uuidv4(),
    role: OpenaiRole.system,
    type: selectedChatType.value,
    action: 'received',
    text: [],
    originalText: [],
    canceled: false,
  });
}

/**
 * Update the {@link selectedChatType} which is used for determining the type of chat.
 * @param chatType Text, Image ... etc
 */
function updateChatType(chatType: ChatType) {
  selectedChatType.value = chatType;
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
 * Update the {@link selectedImageCount} which determines the number of images to generate.
 * @param imageCount
 */
function updateImageCount(imageCount: number) {
  selectedImageCount.value = imageCount;
}

/**
 * Update the {@link selectedImageSize} which determines the size of the image to generate.
 * @param imageSize
 */
function updateImageSize(imageSize: OpenaiImageSize) {
  selectedImageSize.value = imageSize;
}

/**
 * Send message to OpenAI API.
 */
async function sendMessage(event: any) {
  if (event.key === 'Enter') {
    // Prevent current function from being called when shift key is pressed with enter
    if (event.shiftKey) {
      return;
    }

    // Prevent new line being inserted after enter key is pressed
    event.preventDefault();
  }

  // Return if message to send is empty
  if (newMessage.value.trim() === '') {
    return;
  }

  // Construct message to send
  const messageToSend: Message = {
    id: uuidv4(),
    role: OpenaiRole.user,
    type: selectedChatType.value,
    action: 'sent',
    text: [applyMessageTemplate(newMessage.value)],
    originalText: [newMessage.value],
    canceled: false,
  };
  messages.value.push(messageToSend);
  newMessage.value = '';

  switch (toRaw(selectedChatType.value)) {
    case ChatType.TEXT:
      await sendChatMessage();
      break;
    case ChatType.IMAGE:
      await sendGenerateImageMessage();
      break;
  }
}

/**
 * Send message to OpenAI API and stream the response.
 * This function may reformat the message by using {@link messageTemplate}.
 * This function may add previous context by using {@link constructMessageWithPreviousContext}
 * if {@link rememberContext} is true.
 * @param event Keyboard event
 */
async function sendChatMessage() {
  const prompt = new OpenaiChatPrompt(
    await constructMessageWithPreviousContext(),
    selectedModel.value,
    selectedTemperature.value
  );

  // Send message and receive stream response
  let isMessagePushed = false;
  const received = getDefaultReceived();
  await getOpenaiChatResponse(
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
        return new ListenerEvent(ListenerEventType.STOP_STREAM, '');
      }

      return null;
    },
    () => {
      if (rememberContext.value) {
        addContext(OpenaiChatMessage.of1(received.value.text.join(''), OpenaiRole.system));
      }
      isMessageBeingStreamed.value = false;
      return null;
    },
    onApiKeyError
  );
}

async function sendGenerateImageMessage() {
  if (messages.value.length === 0) {
    return;
  }

  const prompt = messages.value[messages.value.length - 1];
  const received = getDefaultReceived();

  await getOpenaiImageGenerationResponse(
    new OpenaiImageGenerationPrompt(
      prompt.text[0],
      selectedImageCount.value,
      selectedImageSize.value
    ),
    (imgUrls) => {
      received.value.text = imgUrls;
    },
    () => {
      // to show progress circular while loading images
      received.value.text = [''];
      messages.value.push(received.value);
      isMessageBeingStreamed.value = true;
      return null;
    },
    () => {
      isMessageBeingStreamed.value = false;
      scrollTarget.value.scrollIntoView();
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
  if (streamingMessage.action === 'received' && !streamingMessage.canceled) {
    streamingMessage.canceled = true;
  }
}

/**
 * Clear all messages and contexts.
 */
function clearMessages() {
  messages.value = [];
  newMessage.value = '';
  messageContexts = [];
}

/**
 * Construct message to be sent to OpenAI API by combining the {@link messageTemplate} and the message if configured.
 * When message template is not configured, the original message is used without any modification.
 * @param message the original message which user typed in
 */
function applyMessageTemplate(message: string): string {
  if (!messageTemplate.value || messageTemplate.value.trim() === '') {
    return message;
  }

  if (messageTemplate.value.includes(messageTemplateInputPlaceholder)) {
    return messageTemplate.value.replace(messageTemplateInputPlaceholder, message);
  } else {
    return messageTemplate.value + '\n' + message;
  }
}

/**
 * Construct messages to be sent to OpenAI API
 * When {@link rememberContext} value is set to true, the context of the previous conversation will be sent to OpenAI API as well.
 * If the size of the previous context is too large, it will be summarized first.
 * @returns {Promise<OpenaiChatMessage[]>} messages to be sent to OpenAI API
 */
async function constructMessageWithPreviousContext(): Promise<OpenaiChatMessage[]> {
  if (messages.value.length == 0) {
    return [];
  }

  const messageToBeSent = messages.value[messages.value.length - 1];

  if (!rememberContext.value) {
    return [OpenaiChatMessage.of1(messageToBeSent.text.join(''), OpenaiRole.user)];
  }

  // Summarize the context if it is too long
  if (messageContexts.length > contextMaxNo.value) {
    const prompt = new OpenaiChatPrompt(
      [...messageContexts, summarizeContextOpenaiMessage],
      selectedModel.value,
      selectedTemperature.value
    );

    const summarizedContext: string[] = [];
    await getOpenaiChatResponse(prompt, (res) => {
      summarizedContext.push(res);
    });
    messageContexts = [OpenaiChatMessage.of1(summarizedContext.join(''), OpenaiRole.system)];
  }

  addContext(OpenaiChatMessage.of1(messageToBeSent.text.join(''), OpenaiRole.user));
  return _.cloneDeep(messageContexts);
}

/**
 * Add context to {@link messageContexts}
 * @param context context to add
 */
function addContext(context: OpenaiChatMessage) {
  messageContexts.push(context);
}

function onApiKeyError(err: string) {
  console.log(err);
  eventBus.emit(EventName.OPEN_SETTINGS, { err: err });
  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: 'API key is invalid',
    color: 'error',
  });
}

function getPosition(message: Message) {
  return {
    display: 'flex',
    'justify-content': message.action === 'sent' ? 'flex-end' : 'flex-start',
  };
}

function getMessageCardClass(type: string) {
  return {
    'message-card': true,
    'message-card-sent': type === 'sent',
    'message-card-received': type === 'received',
  };
}
</script>

<template>
  <div class="parent">
    <div class="chat-message-container">
      <div class="chat-messages">
        <div v-for="message in messages" :key="message.id">
          <div :style="getPosition(message)">
            <chat-message
              :message="message"
              :show-message-template="showMessageTemplate"
              :class="getMessageCardClass(message.action)"
            />
          </div>
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
          :disabled="selectedChatType !== ChatType.TEXT"
        >
          Stop
        </v-btn>
        <v-btn
          v-if="!isMessageBeingStreamed && messages.length > 0"
          size="small"
          variant="plain"
          color="error"
          class="font-weight-bold"
          @click="clearMessages"
        >
          Clear
        </v-btn>
      </div>
    </div>
    <div class="chat-textarea">
      <div class="selectbox-area">
        <v-slide-group v-model="model" show-arrows>
          <v-slide-group-item>
            <chat-type-selector custom-style="mr-2" @update-chat-type="updateChatType" />
          </v-slide-group-item>
          <v-slide-group-item v-if="availability[selectedChatType].has(buttons.MESSAGE_TEMPLATE)">
            <message-template-modal
              custom-style="mr-2"
              @update-message-template="updateMessageTemplate"
              @update-show-message-template="updateShowMessageTemplate"
            />
          </v-slide-group-item>
          <v-slide-group-item v-if="availability[selectedChatType].has(buttons.REMEMBER_CONTEXT)">
            <openai-context-memorizer-modal
              custom-style="mr-2"
              @update-remember-context="updateRememberContext"
            />
          </v-slide-group-item>
          <v-slide-group-item v-if="availability[selectedChatType].has(buttons.OPENAI_MODEL)">
            <openai-model-selector
              :selected-model="selectedModel"
              custom-style="mr-2"
              @update-openai-model="updateOpenaiModel"
            />
          </v-slide-group-item>
          <v-slide-group-item v-if="availability[selectedChatType].has(buttons.TEMPERATURE)">
            <openai-temperature-modal
              :selected-temperature="selectedTemperature"
              @update-openai-temperature="updateOpenaiTemperature"
            />
          </v-slide-group-item>
          <v-slide-group-item v-if="availability[selectedChatType].has(buttons.IMAGE_CONFIG)">
            <openai-image-configuration-modal
              custom-style="mr-2"
              @update-image-count="updateImageCount"
              @update-image-size="updateImageSize"
            />
          </v-slide-group-item>
        </v-slide-group>
      </div>
      <v-textarea
        v-model="newMessage"
        label="Send a message"
        :placeholder="chatTypeInformationMap[selectedChatType].placeholder"
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
  border-bottom: 2px solid #f0f1f5;

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

.entire-row {
  flex: 0 0 100%; /* Let it fill the entire space horizontally */
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
