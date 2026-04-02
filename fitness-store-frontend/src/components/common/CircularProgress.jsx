/**
 * CircularProgress - Animated circular progress ring component
 */
const CircularProgress = ({ current, goal, color = 'text-accent', label, size = 80 }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          className="fill-none stroke-gray-700 dark:stroke-gray-600"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          className={`fill-none transition-all duration-500 stroke-current ${color}`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center text */}
      <div className="absolute text-center">
        <p className={`text-xl font-bold ${color}`}>
          {Math.round(percentage)}%
        </p>
        {label && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
