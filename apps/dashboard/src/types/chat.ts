export interface MessagePart {
  type: "text";
  text: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  // Optional original content if protected
  originalContent?: string;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}
