import React, { useState, useEffect } from 'react';

const USDsHealth = ({remaining}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  function handleValue(number) {
    return Math.floor(number / 1000);
  }

  const value = handleValue(Number(remaining));

  let cappedValue = value || 0;

  if (value > 100) {
    cappedValue = 100;
  }

  let useValue = 100 - cappedValue || 0;


  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(useValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [useValue]);

  const calculateIndicatorPosition = (val) => {
    // Map value 0-100 to angle positions on the semicircle
    const angle = (val / 100) * Math.PI; // 0 to PI radians
    const radius = 59;
    const centerX = 72;
    const centerY = 68;
    const x = centerX - radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    return { x, y };
  };

  const colourPositiveVery = '#4ade80';
  const colourPositive = '#a3e635';
  const colourNeutral = '#facc15';
  const colourNegative = '#fb923c';
  const colourNegativeVery = '#ef4444';
  
  const getSentimentLabel = (val) => {
    if (val < 20) return 'Very Unlikely';
    if (val < 40) return 'Unlikely';
    if (val < 60) return 'Neutral';
    if (val < 80) return 'Possible';
    return 'Very Possible';
  };

  const getSentimentColor = (val) => {
    if (val < 20) return colourPositiveVery;
    if (val < 40) return colourPositive;
    if (val < 60) return colourNeutral;
    if (val < 80) return colourNegative;
    return colourNegativeVery;
  };

  const indicatorPos = calculateIndicatorPosition(animatedValue);

  return (
    <div className="relative w-36 h-20 flex justify-center items-end">
      <svg width="144" height="78" viewBox="0 0 144 78">
      <path
          d="M 13 67.99999999999999 A 59 59 0 0 1 20.699799159192082 38.85742987153037"
          stroke={colourPositiveVery}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 25.25491104204376 32.001435329825206 A 59 59 0 0 1 49.136580399325936 13.610074056278464"
          stroke={colourPositive}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 56.928700281788366 10.957420072336895 A 59 59 0 0 1 87.07129971821165 10.957420072336895"
          stroke={colourNeutral}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 94.86341960067408 13.61007405627847 A 59 59 0 0 1 118.74508895795626 32.00143532982522"
          stroke={colourNegative}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 123.30020084080792 38.85742987153038 A 59 59 0 0 1 131 68"
          stroke={colourNegativeVery}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        <circle
          cx={indicatorPos.x}
          cy={indicatorPos.y}
          r="7"
          fill="none"
          strokeWidth="4"
          className="transition-all duration-500 ease-out stroke-current"
        />
        <circle 
          cx={indicatorPos.x}
          cy={indicatorPos.y}
          r="5"
          fill={getSentimentColor(animatedValue)}
          className="transition-all duration-500 ease-out"
        />
      </svg>
    
      <div className="absolute bottom-0 w-full text-center mb-1">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold transition-all duration-300">
            {Math.round(animatedValue)}
          </div>
          <span 
            className="text-sm font-medium transition-all duration-300 block mt-1"
          >
            {getSentimentLabel(animatedValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default USDsHealth;