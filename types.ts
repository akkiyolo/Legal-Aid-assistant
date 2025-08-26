
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface MessageType {
  id: string;
  role: MessageRole;
  content: string;
}
