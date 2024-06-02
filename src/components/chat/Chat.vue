<script setup lang='ts'>
import { onMounted, onUnmounted, reactive, Ref, ref, toRaw } from 'vue';
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
import { cancelMessageStreaming, completeMessage } from '@/common/message';
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
import { HookedMessages } from '@/service/messages';

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

const scrollableElement = ref<HTMLElement | null>(null);
const programmaticallyScrolling = ref(false);
const hasUserManuallyScrolled = ref(false);
const scrollToDestination: Ref<any> = ref();

const selectedChatType = ref<ChatType>(ChatType.TEXT);
const messageTemplate = ref('');
const showMessageTemplate = ref(false);
const model = ref(null);

const hookedMessages = reactive(new HookedMessages(
  (messages: Message[]) => {
    console.log(`Messages pushed: ${messages}`);
  },
  () => {
    console.log('Messages cleared');
  },
));
const newMessage = ref('');
const isMessageBeingStreamed = ref(false);
const selectedModel: Ref<OpenaiModel> = ref(OpenaiModel['gpt-3.5-turbo']);
const selectedTemperature: Ref<number> = ref(1.0);
const selectedImageCount = ref<number>(1);
const selectedImageSize = ref<OpenaiImageSize>(OpenaiImageSize.SMALL);

let messageContexts: OpenaiChatMessage[] = [];
const summarizeContextOpenaiMessage = OpenaiChatMessage.of(
  'Summarize all the messages in a format as follows. The placeholder for previousContext is where you have to fill in the summarized context.' +
  '\'Previous context: {{previousContext}}\n',
  OpenaiRole.user,
);
const contextMaxNo: Ref<number> = ref(5);
const rememberContext: Ref<boolean> = ref(true);

const lastScrollTop = ref(0);
/**
 * When user scrolls up manually, set {@link hasUserManuallyScrolled} to true.
 * {@link hasUserManuallyScrolled} is used to determine whether to scroll automatically to the
 * bottom of the chat when new message being received.
 */
onMounted(() => {
  scrollableElement.value?.addEventListener('scroll', () => {
    const st = scrollableElement.value?.scrollTop || 0;
    if (st < lastScrollTop.value) {
      hasUserManuallyScrolled.value = true;
    }

    lastScrollTop.value = st <= 0 ? 0 : st;
  });
});

onUnmounted(() => {
  scrollableElement.value?.removeEventListener('scroll', () => {
  });
});

const defaultMessageRef = (): Ref<Message> => {
  return ref<Message>({
    id: uuidv4(),
    role: OpenaiRole.system,
    type: selectedChatType.value,
    action: 'received',
    text: [],
    originalText: [],
    meta: {
      canceled: false,
      completed: false,
    },
  });
};

/**
 * Update the {@link selectedChatType} which is used for determining the type of chat.
 * @param chatType Text, Image ... etc
 */
const updateChatType = (chatType: ChatType) => {
  selectedChatType.value = chatType;
};

/**
 * Update the {@link messageTemplate} which is used for formatting the original message typed by the user.
 * @param template Message template
 */
const updateMessageTemplate = (template: string) => {
  messageTemplate.value = template;
};

/**
 * Update {@link showMessageTemplate} which is used to determine whether to show message formatted with message template.
 * @param showMessage Whether to show message formatted with message template
 */
const updateShowMessageTemplate = (showMessage: boolean) => {
  showMessageTemplate.value = showMessage;
};

/**
 * Update the {@link selectedModel} to use.
 * @param model OpenAI model
 */
const updateOpenaiModel = (model: OpenaiModel) => {
  selectedModel.value = model;
};

/**
 * Update {@link rememberContext}
 * @param shouldRememberContext Whether to remember context or not
 */
const updateRememberContext = (shouldRememberContext: boolean) => {
  if (!shouldRememberContext) {
    messageContexts = [];
  }
  rememberContext.value = shouldRememberContext;
};

/**
 * Update the {@link contextMaxNo} which determines the maximum number of previous context to remember.
 * @param maxNo Maximum number of previous context to remember
 */
const updateContextMaxNo = (maxNo: number) => {
  contextMaxNo.value = maxNo;
};

/**
 * Update the {@link selectedTemperature} of OpenAI API.
 * @param temperature Temperature
 */
const updateOpenaiTemperature = (temperature: number) => {
  selectedTemperature.value = temperature;
};

/**
 * Update the {@link selectedImageCount} which determines the number of images to generate.
 * @param imageCount
 */
const updateImageCount = (imageCount: number) => {
  selectedImageCount.value = imageCount;
};

/**
 * Update the {@link selectedImageSize} which determines the size of the image to generate.
 * @param imageSize
 */
const updateImageSize = (imageSize: OpenaiImageSize) => {
  selectedImageSize.value = imageSize;
};

/**
 * Send message to OpenAI API.
 */
const sendMessage = async (event: any) => {
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
    meta: {
      canceled: false,
      completed: true,
    },
  };
  hookedMessages.pushMessage(messageToSend);
  newMessage.value = '';

  switch (toRaw(selectedChatType.value)) {
    case ChatType.TEXT:
      await sendChatMessage();
      break;
    case ChatType.IMAGE:
      await sendGenerateImageMessage();
      break;
  }
};

/**
 * Send message to OpenAI API and stream the response.
 * This function may reformat the message by using {@link messageTemplate}.
 * This function may add previous context by using {@link constructMessageWithPreviousContext}
 * if {@link rememberContext} is true.
 */
const sendChatMessage = async () => {
  const prompt = new OpenaiChatPrompt(
    await constructMessageWithPreviousContext(),
    selectedModel.value,
    selectedTemperature.value,
  );

  // Send message and receive stream response
  let initialized = false;
  const receivedMessage = defaultMessageRef().value;

  await getOpenaiChatResponse(
    prompt,
    (res) => {
      if (!initialized) {
        // Show received message in the UI
        hookedMessages.pushMessage(receivedMessage);
        initialized = true;
      }

      hookedMessages.pushMessageText(res);
    },
    () => {
      isMessageBeingStreamed.value = true;
      return null;
    },
    () => {
      if (hookedMessages.isCanceled()) {
        return new ListenerEvent(ListenerEventType.STOP_STREAM, '');
      }

      if (!hasUserManuallyScrolled.value) {
        programmaticScroll();
      }

      return null;
    },
    () => {
      hookedMessages.pushMessageCompleted();
      if (rememberContext.value && hookedMessages.hasMessages()) {
        addContext(OpenaiChatMessage.of(hookedMessages.lastMessage()!!.text.join(''), OpenaiRole.system));
      }

      isMessageBeingStreamed.value = false;
      hasUserManuallyScrolled.value = false;
      return null;
    },
    onApiKeyError,
  );
};

const sendGenerateImageMessage = async () => {
  if (!hookedMessages.hasMessages()) {
    return;
  }

  // We can assure that lastMessage exists
  const prompt = hookedMessages.lastMessage()!!;
  const received = defaultMessageRef();

  await getOpenaiImageGenerationResponse(
    new OpenaiImageGenerationPrompt(
      prompt.text[0],
      selectedImageCount.value,
      selectedImageSize.value,
    ),
    (imgUrls) => {
      received.value.text = imgUrls;
    },
    () => {
      received.value.text = [''];
      hookedMessages.pushMessage(received.value);
      isMessageBeingStreamed.value = true;
      return null;
    },
    () => {
      isMessageBeingStreamed.value = false;
      hasUserManuallyScrolled.value = false;
      return null;
    },
    onApiKeyError,
  );
};

const programmaticScroll = _.throttle(() => {
  programmaticallyScrolling.value = true;
  scrollToDestination.value.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    programmaticallyScrolling.value = false;
  }, 1000);
}, 200);

/**
 * Stop streaming response.
 */
const stopStream = () => {
  const streamingMessage = hookedMessages.lastMessage();
  if (
    streamingMessage != null &&
    streamingMessage.action === 'received' &&
    !streamingMessage.meta.completed &&
    !streamingMessage.meta.canceled
  ) {
    cancelMessageStreaming(streamingMessage);
  }
};

/**
 * Clear all messages and contexts.
 */
const clearMessages = () => {
  hookedMessages.clearMessages();
  newMessage.value = '';
  messageContexts = [];
};

/**
 * Construct message to be sent to OpenAI API by combining the {@link messageTemplate} and the message if configured.
 * When message template is not configured, the original message is used without any modification.
 * @param message the original message which user typed in
 */
const applyMessageTemplate = (message: string): string => {
  if (!messageTemplate.value || messageTemplate.value.trim() === '') {
    return message;
  }

  if (messageTemplate.value.includes(messageTemplateInputPlaceholder)) {
    return messageTemplate.value.replace(messageTemplateInputPlaceholder, message);
  } else {
    return messageTemplate.value + '\n' + message;
  }
};

/**
 * Construct messages to be sent to OpenAI API
 * When {@link rememberContext} value is set to true, the context of the previous conversation will be sent to OpenAI API as well.
 * If the size of the previous context is too large, it will be summarized first.
 * @returns {Promise<OpenaiChatMessage[]>} messages to be sent to OpenAI API
 */
const constructMessageWithPreviousContext = async (): Promise<OpenaiChatMessage[]> => {
  if (!hookedMessages.hasMessages()) {
    return [];
  }

  // We can assure that lastMessage exists
  const messageToBeSent = hookedMessages.lastMessage()!!;

  if (!rememberContext.value) {
    return [OpenaiChatMessage.of(messageToBeSent.text.join(''), OpenaiRole.user)];
  }

  // Summarize the context if it is too long
  if (messageContexts.length > contextMaxNo.value) {
    const prompt = new OpenaiChatPrompt(
      [...messageContexts, summarizeContextOpenaiMessage],
      selectedModel.value,
      selectedTemperature.value,
    );

    const summarizedContext: string[] = [];
    await getOpenaiChatResponse(prompt, (res) => {
      summarizedContext.push(res);
    });
    messageContexts = [OpenaiChatMessage.of(summarizedContext.join(''), OpenaiRole.system)];
  }

  addContext(OpenaiChatMessage.of(messageToBeSent.text.join(''), OpenaiRole.user));
  return _.cloneDeep(messageContexts);
};

/**
 * Add context to {@link messageContexts}
 * @param context context to add
 */
const addContext = (context: OpenaiChatMessage) => {
  messageContexts.push(context);
};

const onApiKeyError = (err: string) => {
  eventBus.emit(EventName.OPEN_SETTINGS, { err: err });
  eventBus.emit(EventName.OPEN_SNACKBAR, {
    text: 'API key is invalid',
    color: 'error',
  });
};

const getPosition = (message: Message) => {
  return {
    display: 'flex',
    'justify-content': message.action === 'sent' ? 'flex-end' : 'flex-start',
  };
};
</script>

<template>
  <div class='parent'>
    <div ref='scrollableElement' class='chat-message-container'>
      <div class='chat-messages'>
        <div
          v-for='(message, index) in hookedMessages.messages'
          :key='message.id'
          :style='getPosition(message)'
        >
          <chat-message
            :message='message'
            :show-message-template='showMessageTemplate'
            class='message-card'
            :class='`cy-chat-chat-message-${message.action}-${index}`'
          />
        </div>
      </div>
      <div ref='scrollToDestination' />
      <div class='chat-message-buttons'>
        <v-btn
          v-if='isMessageBeingStreamed'
          size='small'
          variant='plain'
          color='error'
          class='font-weight-bold'
          @click='stopStream'
          :disabled='selectedChatType !== ChatType.TEXT'
        >
          Stop
        </v-btn>
        <v-btn
          v-if='!isMessageBeingStreamed && hookedMessages.hasMessages()'
          size='small'
          variant='plain'
          color='error'
          class='font-weight-bold'
          @click='clearMessages'
        >
          Clear
        </v-btn>
      </div>
    </div>
    <div class='chat-textarea'>
      <v-slide-group v-model='model' class='selectbox-area' show-arrows>
        <v-slide-group-item>
          <chat-type-selector class='cy-chat-type-selector' @update-chat-type='updateChatType' />
        </v-slide-group-item>
        <v-slide-group-item v-if='availability[selectedChatType].has(buttons.MESSAGE_TEMPLATE)'>
          <message-template-modal
            class='cy-message-template-modal'
            @update-message-template='updateMessageTemplate'
            @update-show-message-template='updateShowMessageTemplate'
          />
        </v-slide-group-item>
        <v-slide-group-item v-if='availability[selectedChatType].has(buttons.REMEMBER_CONTEXT)'>
          <openai-context-memorizer-modal
            class='cy-openai-context-memorizer-modal'
            @update-remember-context='updateRememberContext'
            @update-context-max-no='updateContextMaxNo'
          />
        </v-slide-group-item>
        <v-slide-group-item v-if='availability[selectedChatType].has(buttons.OPENAI_MODEL)'>
          <openai-model-selector
            class='cy-openai-model-selector'
            :selected-model='selectedModel'
            @update-openai-model='updateOpenaiModel'
          />
        </v-slide-group-item>
        <v-slide-group-item v-if='availability[selectedChatType].has(buttons.TEMPERATURE)'>
          <openai-temperature-modal
            class='cy-openai-temperature-modal'
            :selected-temperature='selectedTemperature'
            @update-openai-temperature='updateOpenaiTemperature'
          />
        </v-slide-group-item>
        <v-slide-group-item v-if='availability[selectedChatType].has(buttons.IMAGE_CONFIG)'>
          <openai-image-configuration-modal
            class='cy-openai-image-configuration-modal'
            @update-image-count='updateImageCount'
            @update-image-size='updateImageSize'
          />
        </v-slide-group-item>
      </v-slide-group>
      <v-textarea
        v-model='newMessage'
        label='Send a message'
        class='cy-chat-textarea'
        :placeholder='chatTypeInformationMap[selectedChatType].placeholder'
        @keydown.enter='sendMessage'
        :on-click:append-inner='sendMessage'
        variant='outlined'
        shaped
        clearable
        flat
        hide-details
        :disabled='isMessageBeingStreamed'
      />
    </div>
  </div>
</template>

<style scoped>
/* if you want to update the grid-template-rows, you need to update the .chat-message-buttons as well */
.parent {
  display: grid;
  grid-template-rows: 1fr 210px;
  gap: 10px;
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
  gap: 10px;
}

.selectbox-area {
  display: flex;
  align-items: center;
}

.message-card {
  margin-bottom: 10px;
  max-width: 70%;
}

.cy-chat-textarea ::v-deep(.v-field) {
  border-radius: 16px;
}
</style>
