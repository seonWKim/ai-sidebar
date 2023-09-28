import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: ReturnType<typeof uuidv4>;
  type: "sent" | "received";
  text: string[];
  canceled: boolean;
}
