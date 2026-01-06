import React from "react";

interface ProgressBarProps {
  percentage: number;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  color?: "blue" | "green" | "purple" | "gradient";
}

export function ProgressBar({
  percentage,
  height = "md",
  showLabel = false,
  color = "gradient",
}: ProgressBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`${heights[height]} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-right">
          {safePercentage}%
        </p>
      )}
    </div>
  );
}
