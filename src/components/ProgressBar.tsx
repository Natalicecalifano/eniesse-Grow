import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ progress, className, showLabel = false }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] opacity-40">Progresso</span>
          <span className="text-3xl font-bold text-primary italic leading-none tracking-tighter">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-4 w-full bg-primary/5 rounded-full overflow-hidden p-1 border border-primary/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-primary rounded-full shadow-lg shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};
