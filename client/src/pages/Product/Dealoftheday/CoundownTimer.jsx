import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const left = getTimeLeft();

      if (left.total <= 0) {
        // Reset lại 3 ngày mới
        localStorage.setItem("startTime", Date.now());
        setTimeLeft(getTimeLeft(true)); // true: reset
      } else {
        setTimeLeft(left);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 flex gap-3 items-center justify-center mb-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map((item, i) => (
        <span key={i} className="flex flex-col items-center">
          <span className="rounded-full bg-slate-200 flex items-center justify-center font-medium text-gray-500 p-4 w-10 h-10">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="font-medium text-gray-600">{item.label}</span>
        </span>
      ))}
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
  const total = endTime - now;

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

export default CountdownTimer;
