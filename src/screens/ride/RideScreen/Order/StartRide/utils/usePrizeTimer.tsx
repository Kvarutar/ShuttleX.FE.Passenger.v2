import { useEffect, useState } from 'react';

const useTimer = (endTime: Date) => {
  const [remainingTime, setRemainingTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const targetTime = endTime.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime({
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      } else {
        setRemainingTime({ hours: '00', minutes: '00', seconds: '00' });
      }
    };

    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [endTime]);

  return remainingTime;
};

export default useTimer;
