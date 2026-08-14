export interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
  allergens: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedItems?: MenuItem[];
}
