import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconBadgeProps = {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
};

const sizeClasses = {
  sm: {
    wrapper: "h-10 w-10",
    icon: "h-4 w-4",
  },
  md: {
    wrapper: "h-12 w-12",
    icon: "h-5 w-5",
  },
  lg: {
    wrapper: "h-14 w-14",
    icon: "h-6 w-6",
  },
};

const IconBadge = ({ icon: Icon, size = "md", className, iconClassName }: IconBadgeProps) => {
  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-300",
        "bg-soft-pink text-primary ring-1 ring-primary/10",
        "dark:bg-primary dark:text-cream dark:ring-0 dark:shadow-[0_0_15px_rgba(var(--primary),0.2)]",
        styles.wrapper,
        className,
      )}
    >
      <Icon strokeWidth={2.5} className={cn("shrink-0", styles.icon, iconClassName)} />
    </div>
  );
};

export default IconBadge;
