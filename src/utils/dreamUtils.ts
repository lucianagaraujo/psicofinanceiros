import { Milestone } from '@/types/dreams';

export const calculateProgress = (milestones: Milestone[]): number => {
  if (milestones.length === 0) return 0;
  
  const completedMilestones = milestones.filter(milestone => milestone.completed).length;
  return Math.round((completedMilestones / milestones.length) * 100);
}; 