export interface Milestone {
  id: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Dream {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  progress: number;
} 