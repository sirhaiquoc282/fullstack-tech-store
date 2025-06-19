import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const left = getTimeLeft();

      if (left.total <= 0) {
        localStorage.setItem("startTime", Date.now());
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1000);
        setTimeLeft(getTimeLeft(true));
      } else {
        setTimeLeft(left);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center relative">
      <div className={`relative rounded-lg overflow-hidden w-14 h-14 flex items-center justify-center
        ${isFlashing ? 'bg-red-500' : 'bg-gray-100'} transition-colors duration-300`}>

        {/* Top half - current value */}
        <div className="absolute top-0 w-full h-1/2 overflow-hidden">
          <div className="w-full h-full flex items-end justify-center pb-0.5">
            <span className={`text-xl font-bold ${isFlashing ? 'text-white' : 'text-red-600'}`}>
              {String(value).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Bottom half - next value */}
        <div className="absolute bottom-0 w-full h-1/2 overflow-hidden">
          <div className="w-full h-full flex items-start justify-center pt-0.5">
            <span className="text-xl font-bold text-gray-400">
              {String(value).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
      </div>

      <span className="text-xs font-medium text-gray-500 mt-1.5">
        {label}
      </span>
    </div>
  );

  return (
    <div className="py-3">
      <p className="text-xs font-medium text-gray-500 mb-3 text-center">
        Kết thúc sau
      </p>

      <div className="flex justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="Ngày" />
        <TimeUnit value={timeLeft.hours} label="Giờ" />
        <TimeUnit value={timeLeft.minutes} label="Phút" />
        <TimeUnit value={timeLeft.seconds} label="Giây" />
      </div>
    </div>
  );
};

function getTimeLeft(forceReset = false) {
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  let startTime = localStorage.getItem("startTime");

  if (!startTime || forceReset) {
    startTime = Date.now();
    localStorage.setItem("startTime", startTime);
  }

  const now = Date.now();
  const endTime = parseInt(startTime) + THREE_DAYS;
  const total = Math.max(0, endTime - now);

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

export default CountdownTimer;