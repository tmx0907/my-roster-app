// src/components/Calendar.tsx
import React, { useState } from 'react';
import './Calendar.css';
import { workSchedule } from '@/data/workSchedule'; // 작업 스케줄 데이터 import

const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const Calendar: React.FC<{ initialDate?: Date }> = ({ initialDate }) => {
  const today = new Date();
  const [currentDate] = useState(initialDate || today);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // 현재 달의 스케줄만 필터링
  const monthSchedule = workSchedule.filter(item => {
    const date = new Date(item.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const days: JSX.Element[] = [];

  // 첫 주 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // 각 날짜 생성
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    // 스케줄에 해당 날짜가 있는지 확인
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const scheduleForDay = monthSchedule.find(item => item.date === dateString);
    const hasShift = !!scheduleForDay;

    days.push(
      <div
        key={d}
        className={`calendar-day${isToday ? ' today' : ''}${hasShift ? ' has-shift' : ''}`}
        title={scheduleForDay ? `${scheduleForDay.assigned_to} shift` : undefined}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="calendar">
      {/* 필요하다면 상단에 월/연도 네비게이션 추가 */}
      <div className="calendar-days-grid">{days}</div>
    </div>
  );
};

export default Calendar;
