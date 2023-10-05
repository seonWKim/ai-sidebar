import { appStore } from "@/store/app";

const mockOpenaiApiResponseInterval: number = appStore().mockOpenaiApiResponseInterval;
const MOCK_RESPONSE_STREAM: string[] = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur! Commodi minima excepturi repudiandae velit hic maxime doloremque. Quaerat provident commodi consectetur veniam similique ad earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam quasi aliquam eligendi, placeat qui corporis!"
  .split(" ");

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

export class OpenaiMessage {
  role: OpenaiRole;
  content: string;

  constructor(role: OpenaiRole, content: string) {
    this.role = role;
    this.content = content;
  }
}

export enum OpenaiRole {
  system = "system",
  user = "user",
  assistant = "assistant",
}

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
        stream: true,
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
