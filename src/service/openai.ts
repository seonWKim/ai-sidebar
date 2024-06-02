import { appStore } from '@/store/app';
import { MOCK_RESPONSE_STREAM, MOCK_RESPONSE_IMAGE } from '@/common/mocks';

const MOCK_OPENAI_API_RESPONSE_INTERVAL: number = appStore().mockOpenaiApiResponseInterval;
const MOCK_OPENAI: boolean = appStore().mockOpenai;

/**
 * OpenAI Role - The role of the author of this message.
 */
enum OpenaiRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

/**
 * OpenAI Model - The model used for the chat completion.
 */
enum OpenaiModel {
  'gpt-4' = 'gpt-4',
  'gpt-4-0613' = 'gpt-4-0613',
  'gpt-4-32k' = 'gpt-4-32k',
  'gpt-4-32k-0613' = 'gpt-4-32k-0613',
  'gpt-3.5-turbo' = 'gpt-3.5-turbo',
  'gpt-3.5-turbo-0613' = 'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k' = 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-16k-0613' = 'gpt-3.5-turbo-16k-0613',
}

enum ListenerEventType {
  STOP_STREAM = 'stop-stream',
}

/**
 * Event that might happen during {@link getOpenaiChatResponse} function call.
 */
class ListenerEvent {
  type: ListenerEventType;
  data: any;

  constructor(type: ListenerEventType, data: any) {
    this.type = type;
    this.data = data;
  }
}

/**
 * Stores values which are used to construct OpenAI API request.
 * @field messages - list of {@link OpenaiChatMessage} objects which are used as a prompt for OpenAI API.
 * @field model - {@link OpenaiModel} which is used to set OpenAI model
 * @field temperature - temperature which is used to set OpenAI temperature. Should be between 0 and 2.
 */
class OpenaiChatPrompt {
  messages: OpenaiChatMessage[];
  model: OpenaiModel;
  temperature: number;

  constructor(
    messages: OpenaiChatMessage[],
    model: OpenaiModel = OpenaiModel['gpt-3.5-turbo'],
    temperature: number = 1
  ) {
    this.messages = messages;
    this.model = model;
    this.temperature = temperature;
  }
}

/**
 * Stores values which are used to construct OpenAI API request's messages.
 * @field content - content of the message
 * @field role - {@link OpenaiRole} which is used to set OpenAI role
 */
class OpenaiChatMessage {
  content: string;
  role: OpenaiRole = OpenaiRole.user;

  constructor(content: string, role: OpenaiRole) {
    this.content = content;
    this.role = role;
  }

  static of(content: string, role: OpenaiRole) {
    return new OpenaiChatMessage(content, role);
  }
}

enum OpenaiImageFormat {
  URL = 'url',
  B64_JSON = 'b64_json',
}

enum OpenaiImageSize {
  SMALL = '256x256',
  MEDIUM = '512x512',
  LARGE = '1024x1024',
}

class OpenaiImageGenerationPrompt {
  content: string;
  numberOfImages: number;
  size: OpenaiImageSize;
  response_format: OpenaiImageFormat;

  constructor(
    prompt: string,
    numberOfImages: number = 1,
    size: OpenaiImageSize = OpenaiImageSize.SMALL,
    response_format: OpenaiImageFormat = OpenaiImageFormat.B64_JSON
  ) {
    this.content = prompt;
    this.numberOfImages = numberOfImages;
    this.size = size;
    this.response_format = response_format;
  }
}

const getOpenaiChatResponse = MOCK_OPENAI
  ? async function (
      prompt: OpenaiChatPrompt,
      consumer: (message: string) => void,
      beforeStreamListener: () => ListenerEvent | null = () => null,
      middleOfStreamListener: () => ListenerEvent | null = () => null,
      endOfStreamListener: () => ListenerEvent | null = () => null,
      onError: (error: any) => void = () => {}
    ): Promise<void> {
      beforeStreamListener();
      try {
        for (const part of MOCK_RESPONSE_STREAM) {
          const event = middleOfStreamListener();
          if (event?.type == ListenerEventType.STOP_STREAM) {
            break;
          }

          await new Promise((resolve, _) => setTimeout(resolve, MOCK_OPENAI_API_RESPONSE_INTERVAL));
          consumer(part + ' ');
        }
      } catch (e) {
        onError(e);
      } finally {
        endOfStreamListener();
      }
    }
  : async function (
      prompt: OpenaiChatPrompt,
      consumer: (message: string) => void,
      beforeStreamListener: () => ListenerEvent | null = () => null,
      middleOfStreamListener: () => ListenerEvent | null = () => null,
      endOfStreamListener: () => ListenerEvent | null = () => null,
      onError: (error: any) => void = () => {}
    ): Promise<void> {
      beforeStreamListener();
      try {
        if (!appStore().openai) {
          throw new Error('OpenAI is not initialized');
        }

        const stream = await appStore().openai!.chat.completions.create({
          messages: prompt.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          model: prompt.model,
          temperature: prompt.temperature,
          stream: true,
        });

        for await (const part of stream) {
          const event = middleOfStreamListener();
          if (event?.type == ListenerEventType.STOP_STREAM) {
            stream.controller.abort();
            break;
          }

          consumer(part.choices[0]?.delta?.content || '');
        }
      } catch (e) {
        onError(e);
      } finally {
        endOfStreamListener();
      }
    };

const getOpenaiImageGenerationResponse = MOCK_OPENAI
  ? async function (
      prompt: OpenaiImageGenerationPrompt,
      consumer: (message: string[]) => void,
      beforeRequestListener: () => ListenerEvent | null = () => null,
      endOfRequestListener: () => ListenerEvent | null = () => null,
      onError: (error: any) => void = () => {}
    ) {
      beforeRequestListener();
      try {
        consumer(MOCK_RESPONSE_IMAGE);
      } catch (e) {
        onError(e);
      } finally {
        endOfRequestListener();
      }
    }
  : async function (
      prompt: OpenaiImageGenerationPrompt,
      consumer: (message: string[]) => void,
      beforeRequestListener: () => ListenerEvent | null = () => null,
      endOfRequestListener: () => ListenerEvent | null = () => null,
      onError: (error: any) => void = () => {}
    ): Promise<void> {
      beforeRequestListener();
      try {
        const imageResponse = await appStore().openai!.images.generate({
          prompt: prompt.content,
          n: prompt.numberOfImages,
          response_format: prompt.response_format,
          size: prompt.size,
        });

        const key = prompt.response_format;
        consumer(imageResponse.data.filter((img) => img[key]).map((img) => img[key]!));
      } catch (e) {
        onError(e);
      } finally {
        endOfRequestListener();
      }
    };

export {
  OpenaiChatPrompt,
  OpenaiChatMessage,
  OpenaiImageGenerationPrompt,
  OpenaiRole,
  OpenaiModel,
  OpenaiImageFormat,
  OpenaiImageSize,
  ListenerEvent,
  ListenerEventType,
  getOpenaiChatResponse,
  getOpenaiImageGenerationResponse,
};
