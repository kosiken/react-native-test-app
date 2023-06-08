export interface ICardItem {
  name: string;
  description: string;
  language: string;
  star: number;
  fork: number;
}

export interface AppEvents {
  type: "activity" | "comment";
  createdAt: string;
  author: string;
  activity?: {
    type: string;
    status: string;
  };
  message?: {
    title: string;
    description: string;
    receiver: string;
  };
}

export type AppEventsWithChildren = AppEvents & { children: AppEvents[] };
