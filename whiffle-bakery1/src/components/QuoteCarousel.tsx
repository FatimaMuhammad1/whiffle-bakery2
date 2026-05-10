import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Whiffle transformed my weekend baking from stressful to purely joyful. The tools are so intuitive!",
    author: "Sarah Jenkins",
    role: "Home Baker since 2020"
  },
  {
    text: "I finally understand how to get that perfect crumb. The guidance that comes with every kit is a game-changer.",
    author: "Michael Chen",
    role: "Sourdough Enthusiast"
  },
  {
    text: "The quality of the ingredients is unmatched. You can really taste the difference in every bite.",
    author: "Emma Rodriguez",
    role: "Pastry Student"
  }
];

const QuoteCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 rotate-12">
          <Quote size={200} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Quote size={24} />
          </div>
        </div>
        
        <div className="relative h-[250px] md:h-[200px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-all duration-1000 transform",
                i === activeIndex 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              )}
            >
              <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground italic mb-8 leading-snug">
                "{t.text}"
              </blockquote>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                <p className="font-body font-bold text-primary text-lg">{t.author}</p>
                <p className="font-body text-muted-foreground text-sm uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i === activeIndex ? "bg-primary w-8" : "bg-primary/20 hover:bg-primary/40"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteCarousel;
