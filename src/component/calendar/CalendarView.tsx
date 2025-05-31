import React, { useState } from 'react';
import { MealMenu } from '../../types/meal.ts';
import MealPopup from '../meal/MealPopup.tsx';
import './CalendarView.css';

interface Props {
  mealMenus: MealMenu[];
}

const CalendarView: React.FC<Props> = ({ mealMenus }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const year = 2025;
  const daysInMonth = new Date(year, month, 0).getDate();
  const title = `${year}년 ${month}월 식단`;

  const openPopup = (date: string) => setSelectedDate(date);
  const closePopup = () => setSelectedDate(null);

  const dateStringsInMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });

  const hasMenuForDate = (date: string): boolean => {
    return mealMenus.some(menu => menu.date === date);
  };

  const changeMonth = (delta: number) => {
    const newMonth = month + delta;
    if (newMonth >= 1 && newMonth <= 12) {
      setMonth(newMonth);
      setSelectedDate(null);
    }
  };

  const firstDayOfMonth = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  const weekDays = ['월', '화', '수', '목', '금'];

  return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button
              onClick={() => changeMonth(-1)}
              disabled={month <= 1}
              className="calendar-button"
          >
            ← 이전 달
          </button>
          <h2>{title}</h2>
          <button
              onClick={() => changeMonth(1)}
              disabled={month >= 12}
              className="calendar-button"
          >
            다음 달 →
          </button>
        </div>

        <div className="weekday-header">
          {weekDays.map((day, idx) => (
              <div key={idx}>{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {Array(startDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
          ))}

          {dateStringsInMonth.map(date => {
            const day = new Date(date).getDate();
            const dayOfWeek = new Date(date).getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) return null;

            const hasMenu = hasMenuForDate(date);

            return (
                <button
                    key={date}
                    onClick={() => hasMenu && openPopup(date)}
                    disabled={!hasMenu}
                    className={`calendar-day-cell ${hasMenu ? 'has-menu' : 'no-menu'}`}
                >
                  {day}
                </button>
            );
          })}
        </div>

        {selectedDate && (
            <MealPopup
                date={selectedDate}
                meals={mealMenus.filter(m => m.date === selectedDate)}
                onClose={closePopup}
            />
        )}
      </div>
  );
};

export default CalendarView;
