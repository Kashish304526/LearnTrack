import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  height?: string;
  color?: string;
}

/**
 * Reusable ProgressBar component for displaying progress
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  height = 'h-4',
  color = 'bg-primary-600',
}) => {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${normalizedPercentage}%` }}
        >
          {showLabel && normalizedPercentage > 10 && (
            <span className="text-xs font-medium text-white">
              {normalizedPercentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      {showLabel && normalizedPercentage <= 10 && (
        <p className="text-sm text-gray-600 mt-1 text-right">
          {normalizedPercentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
};

export default ProgressBar;