import React, { useState, useEffect } from 'react';
import { ADToBS } from 'bikram-sambat-js';
import WeatherInfo from './Location';

const DateTimeDisplay: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const engDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const bsDate = ADToBS(now);

  function formatTime12Hour(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return hours + ':' + minutesStr + ' ' + ampm;
  }
  const time = formatTime12Hour(now);

  return (
    <>
      <span className="text-base font-semibold">{bsDate} | {engDate}</span>
      <div className="flex flex-row items-center mt-1 gap-4">
        <span className="text-gray-500 font-semibold">{time}</span>
        <WeatherInfo className="text-sm font-medium text-blue-700" />
      </div>
    </>
  );
};

export default DateTimeDisplay;