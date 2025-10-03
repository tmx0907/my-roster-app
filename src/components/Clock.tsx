import React, { useEffect, useRef } from 'react';

/**
 * Morphing clock component.
 * - 테두리: #718BBC
 * - 시침/분침: #EAC4D5
 */
const Clock: React.FC = () => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // 시간 계산 및 회전 적용
  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const hourAngle = (hours + minutes / 60) * 30;      // 360° / 12h
    const minuteAngle = (minutes + seconds / 60) * 6;    // 360° / 60m

    if (hourRef.current) {
      hourRef.current.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    }
    if (minuteRef.current) {
      minuteRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    }
  };

  useEffect(() => {
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* 모핑되는 원형 테두리 */}
      <div
        className="absolute inset-0 border-[6px] border-[#718BBC]"
        style={{
          borderRadius: '50%',
          animation: 'morph-shape 20s infinite ease-in-out',
        }}
      />
      {/* 시침과 분침 */}
      <div
        ref={hourRef}
        className="absolute left-1/2 top-1/2 w-[6px] h-20 bg-[#EAC4D5] rounded-md"
        style={{ transformOrigin: '50% 100%' }}
      />
      <div
        ref={minuteRef}
        className="absolute left-1/2 top-1/2 w-[4px] h-24 bg-[#EAC4D5] rounded-md"
        style={{ transformOrigin: '50% 100%' }}
      />
      {/* 가운데 점 */}
      <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#718BBC] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default Clock;
