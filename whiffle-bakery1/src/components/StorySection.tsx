import React from 'react';
import { cn } from "@/lib/utils";

interface StorySectionProps {
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  className?: string;
  eyebrow?: string;
}

const StorySection: React.FC<StorySectionProps> = ({
  title,
  subtitle,
  content,
  image,
  imageAlt,
  reverse = false,
  className,
  eyebrow
}) => {
  return (
    <section className={cn("py-20 overflow-hidden", className)}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
          reverse ? "lg:flex-row-reverse" : ""
        )}>
          <div className={cn(
            "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700",
            reverse ? "lg:order-2" : "lg:order-1"
          )}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-heading text-xl text-primary italic">
                {subtitle}
              </p>
            )}
            <div className="font-body text-muted-foreground text-lg leading-relaxed space-y-4">
              {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
          </div>
          
          {image && (
            <div className={cn(
              "relative group animate-in fade-in zoom-in-95 duration-1000",
              reverse ? "lg:order-1" : "lg:order-2"
            )}>
              <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src={image} 
                  alt={imageAlt || title} 
                  className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StorySection;
