export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  components: string[];
  field: 'IoT' | 'Robotics' | 'Analog' | 'Embedded' | 'Power';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY_ASSISTANT = 'STUDY_ASSISTANT',
  PROJECT_LAB = 'PROJECT_LAB',
  MARKET_INSIGHTS = 'MARKET_INSIGHTS',
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
