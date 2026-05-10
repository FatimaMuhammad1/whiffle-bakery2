import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  secondaryText?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  secondaryText,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-700", className)}>
      <div className="relative mb-8 group">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:bg-primary/30 transition-colors duration-500" />
        
        {/* Icon Container */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-card border-2 border-primary/20 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <Icon className="text-primary w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
          <div className="absolute -top-2 -right-2 bg-primary text-cream p-2 rounded-full shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
        {title}
      </h1>
      
      <p className="font-body text-muted-foreground text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          to={actionLink} 
          className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-heading font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          {actionText}
          <ArrowRight size={20} />
        </Link>
        
        {secondaryText && (
          <p className="font-body text-sm text-muted-foreground italic">
            {secondaryText}
          </p>
        )}
      </div>
      
      {/* Decorative dots */}
      <div className="mt-16 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/20" />
        <div className="w-2 h-2 rounded-full bg-primary/40" />
        <div className="w-2 h-2 rounded-full bg-primary/20" />
      </div>
    </div>
  );
};

export default EmptyState;
