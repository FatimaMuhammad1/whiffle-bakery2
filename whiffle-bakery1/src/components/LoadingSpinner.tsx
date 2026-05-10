import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1.5} />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
      </div>
      <div className="space-y-1 text-center">
        <p className="font-heading text-2xl font-bold text-foreground">Preheating the Oven...</p>
        <p className="font-body text-sm text-muted-foreground animate-pulse">Gathering the finest ingredients</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
