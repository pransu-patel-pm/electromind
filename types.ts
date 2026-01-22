export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
  imageUrl?: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  components: string[];
  field: 'IoT' | 'Robotics' | 'Analog' | 'Embedded' | 'Power';
}

export interface ComponentData {
  name: string;
  description: string;
  specs: Array<{ param: string; value: string }>;
  pinout: string;
  imageUrl?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY_ASSISTANT = 'STUDY_ASSISTANT',
  PROJECT_LAB = 'PROJECT_LAB',
  MARKET_INSIGHTS = 'MARKET_INSIGHTS',
  COMPONENT_DETAILS = 'COMPONENT_DETAILS',
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}