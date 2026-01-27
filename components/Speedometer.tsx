
import React from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const maxSpeed = 100;
  const clampedSpeed = Math.min(Math.max(speed, 0), maxSpeed);
  const percentage = clampedSpeed / maxSpeed;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage * (circumference / 2)); // 半圆

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24">
        <svg className="w-full h-full transform -rotate-180" viewBox="0 0 140 80">
          {/* Background track */}
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress bar */}
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke={speed > 55 ? "#ef4444" : "#2563eb"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference / 2}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
          <span className="text-3xl font-bold text-slate-800">{speed}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">KM/H</span>
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-slate-500">
        Status: <span className={speed > 55 ? "text-red-500" : "text-green-500"}>
          {speed > 55 ? "Overspeeding" : "Safe Speed"}
        </span>
      </div>
    </div>
  );
};

export default Speedometer;
