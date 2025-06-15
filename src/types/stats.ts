
import { LucideIcon } from 'lucide-react';

export interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend: string;
  trendDirection: 'up' | 'down';
}
