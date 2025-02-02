import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const colorClasses = {
  primary: "bg-blue-600",
  secondary: "bg-gray-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  error: "bg-red-600",
};

type LinearProgressPropsType = {
  variant: "determinate" | "indeterminate";
  value?: number;
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
};

export default function LinearProgress(props: LinearProgressPropsType) {
  const {
    variant = "indeterminate",
    value = 0,
    className,
    color = "primary",
  } = props;

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (variant === "determinate") {
      setProgress(value);
    } else {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          }
          return oldProgress + 2;
        });
      }, 100);

      return () => {
        clearInterval(timer);
      };
    }
  }, [variant, value]);

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50", className)}>
      <Progress
        value={progress}
        className={cn(
          "h-1 w-full bg-gray-200",
          variant === "indeterminate" && "relative overflow-hidden",
          "[&>div]:transition-all",
          `[&>div]:${colorClasses[color]}`,
          variant === "indeterminate" && [
            "[&>div]:absolute",
            "[&>div]:animate-[linear-progress_1.5s_ease-in-out_infinite]",
            "[&>div]:w-1/2",
            "[&>div]:-translate-x-full",
          ],
          className
        )}
      />
    </div>
  );
}
