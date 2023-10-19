import { appStore } from "@/store/app";

const mockOpenaiApiResponseInterval: number = appStore().mockOpenaiApiResponseInterval;
const MOCK_RESPONSE_STREAM: string[] = ("Lorem ipsum dolor sit amet consectetur adipisicing elit. " +
  "Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam " +
  "blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident " +
  "laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae.\n " +
  "```java\n" +
  "public class HelloWorld {\n" +
  "    public static void main(String[] args) {\n" +
  "        System.out.println(\"Hello, world!\");\n" +
  "    }\n" +
  "}\n" +
  "```")
  .split(" ");

/**
 * Stores values which are used to construct OpenAI API request.
 * @field messages - list of {@link OpenaiMessage} objects which are used as a prompt for OpenAI API.
 * @field model - {@link OpenaiModel} which is used to set OpenAI model
 * @field temperature - temperature which is used to set OpenAI temperature. Should be between 0 and 2.
 */
export class OpenaiPrompt {
  messages: OpenaiMessage[];
  model: OpenaiModel;
  temperature: number;

  constructor(messages: OpenaiMessage[],
              model: OpenaiModel = OpenaiModel["gpt-3.5-turbo"],
              temperature: number = 1) {
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
export class OpenaiMessage {
  content: string;
  role: OpenaiRole = OpenaiRole.user;

  constructor(content: string, role: OpenaiRole) {
    this.content = content;
    this.role = role;
  }

  static of0(content: string): OpenaiMessage {
    return new OpenaiMessage(content, OpenaiRole.user);
  }

  static of1(content: string, role: OpenaiRole) {
    return new OpenaiMessage(content, role);
  }
}

/**
 * OpenAI Role - The role of the author of this message.
 */
export enum OpenaiRole {
  system = "system",
  user = "user",
  assistant = "assistant",
}

/**
 * OpenAI Model - The model used for the chat completion.
 */
export enum OpenaiModel {
  "gpt-4" = "gpt-4",
  "gpt-4-0613" = "gpt-4-0613",
  "gpt-4-32k" = "gpt-4-32k",
  "gpt-4-32k-0613" = "gpt-4-32k-0613",
  "gpt-3.5-turbo" = "gpt-3.5-turbo",
  "gpt-3.5-turbo-0613" = "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k" = "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613" = "gpt-3.5-turbo-16k-0613"
}

/**
 * Event that might happen during {@link streamOpenAiResponse} function call.
 */
export class ListenerEvent {
  type: ListenerEventType;
  data: any;

  constructor(type: ListenerEventType, data: any) {
    this.type = type;
    this.data = data;
  }
}

export enum ListenerEventType {
  STOP_STREAM = "stop-stream"
}

const streamOpenAiResponse = appStore().mockOpenai ?
  async function(prompt: OpenaiPrompt,
                 consumer: (message: string) => void,
                 beforeStreamListener: () => ListenerEvent | null = () => null,
                 middleOfStreamListener: () => ListenerEvent | null = () => null,
                 endOfStreamListener: () => ListenerEvent | null = () => null,
                 onError: (error: any) => void = () => {
                 }): Promise<void> {
    try {
      beforeStreamListener();

      for (const part of MOCK_RESPONSE_STREAM) {
        const event = middleOfStreamListener();
        if (event?.type == ListenerEventType.STOP_STREAM) {
          break;
        }

        await new Promise((resolve, _) => setTimeout(resolve, mockOpenaiApiResponseInterval));
        consumer(part + " ");
      }

      endOfStreamListener();
    } catch (e) {
      onError(e);
    }
  } :
  async function(prompt: OpenaiPrompt,
                 consumer: (message: string) => void,
                 beforeStreamListener: () => ListenerEvent | null = () => null,
                 middleOfStreamListener: () => ListenerEvent | null = () => null,
                 endOfStreamListener: () => ListenerEvent | null = () => null,
                 onError: (error: any) => void = () => {
                 }
  ): Promise<void> {
    try {
      if (!appStore().openai) {
        throw new Error("OpenAI is not initialized");
      }

      const stream = await appStore().openai!.chat.completions.create({
        messages: prompt.messages.map(message => ({
          role: message.role,
          content: message.content
        })),
        model: prompt.model,
        temperature: prompt.temperature,
        stream: true
      });

      beforeStreamListener();

      for await (const part of stream) {
        const event = middleOfStreamListener();
        if (event?.type == ListenerEventType.STOP_STREAM) {
          stream.controller.abort();
          break;
        }

        consumer(part.choices[0]?.delta?.content || "");
      }

      endOfStreamListener();
    } catch (e) {
      onError(e);
    }
  };

export {
  streamOpenAiResponse
};
