import { v4 as uuidv4 } from "uuid";
import { OpenaiRole } from "@/service/openai";

export interface Message {
  id: ReturnType<typeof uuidv4>;
  role: OpenaiRole;
  type: "sent" | "received";
  text: string[];
  canceled: boolean;
}
