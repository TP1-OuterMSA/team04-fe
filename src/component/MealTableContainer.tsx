import React, { useState, useMemo } from 'react';
import MealTable from './MealTable';
import { MealMenu } from '../types/meal';

interface Props {
  mealMenus: MealMenu[];
}

const MealTableContainer: React.FC<Props> = ({ mealMenus }) => {
  const [baseDate, setBaseDate] = useState(new Date());

  const { monday, friday, dateRange } = useMemo(() => {
    const dayOfWeek = baseDate.getDay();
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return {
      monday: stripTime(monday),
      friday: stripTime(friday),
      dateRange: `${formatDate(monday)} ~ ${formatDate(friday)}`,
    };
  }, [baseDate]);

  const getWeekNumber = (date: Date): number => {
    return Math.min(4, Math.ceil(date.getDate() / 7));
  };

  const title = `${monday.getFullYear()}년 ${monday.getMonth() + 1}월 ${getWeekNumber(monday)}주차 식단표`;

  const thisWeekMenus = useMemo(() => {
    if (!mealMenus.length) return [];

    const startDate = monday.getTime();
    const endDate = friday.getTime();

    return mealMenus.filter(menu => {
      const menuDate = new Date(menu.date + 'T00:00:00').getTime();
      return menuDate >= startDate && menuDate <= endDate;
    });
  }, [mealMenus, monday, friday]);

  const hasPreviousWeek = useMemo(() => {
    if (!mealMenus.length) return false;

    const prevMonday = new Date(monday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    const prevFriday = new Date(prevMonday);
    prevFriday.setDate(prevMonday.getDate() + 4);

    return mealMenus.some(menu => {
      const menuDate = new Date(menu.date + 'T00:00:00');
      return menuDate >= prevMonday && menuDate <= prevFriday;
    });
  }, [mealMenus, monday]);

  const hasNextWeek = useMemo(() => {
    if (!mealMenus.length) return false;

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextFriday = new Date(nextMonday);
    nextFriday.setDate(nextMonday.getDate() + 4);

    return mealMenus.some(menu => {
      const menuDate = new Date(menu.date + 'T00:00:00');
      return menuDate >= nextMonday && menuDate <= nextFriday;
    });
  }, [mealMenus, monday]);

  return (
      <div className="container">
        <h1>{title} ({dateRange})</h1>

        <div style={{ minHeight: '600px' }}>
          {thisWeekMenus.length > 0 ? (
              <MealTable mealMenus={thisWeekMenus} />
          ) : (
              <p style={{ marginTop: '2rem' }}>해당 주차의 식단 정보가 없습니다.</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
          <button
              onClick={() => setBaseDate(prev => {
                const copy = new Date(prev);
                copy.setDate(copy.getDate() - 7);
                return copy;
              })}
              disabled={!hasPreviousWeek}
              style={{
                padding: '0.5rem 1rem',
                cursor: hasPreviousWeek ? 'pointer' : 'not-allowed',
                opacity: hasPreviousWeek ? 1 : 0.5,
              }}
          >
            이전 주
          </button>
          <button
              onClick={() => setBaseDate(prev => {
                const copy = new Date(prev);
                copy.setDate(copy.getDate() + 7);
                return copy;
              })}
              disabled={!hasNextWeek}
              style={{
                padding: '0.5rem 1rem',
                cursor: hasNextWeek ? 'pointer' : 'not-allowed',
                opacity: hasNextWeek ? 1 : 0.5,
              }}
          >
            다음 주
          </button>
        </div>
      </div>
  );
};

function formatDate(date: Date): string {
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default MealTableContainer;
