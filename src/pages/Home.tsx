import { useState, useEffect } from 'react';
import MealTableContainer from '../component/mealtable/MealTableContainer.tsx';
import CalendarView from '../component/calendar/CalendarView.tsx';
import { MealMenu } from '../types/meal';
import { MealMenuFetcher } from '../services/MealMenuFetcher';
import mjuLogo from '../assets/mju.png';  // 이렇게 import

export default function Home() {
  const [viewMode, setViewMode] = useState<'week' | 'calendar'>('week');
  const [mealMenus, setMealMenus] = useState<MealMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    new MealMenuFetcher().fetch().then((menus) => {
      setMealMenus(menus);
      setIsLoading(false);
    });
  }, []);

  return (
      <div style={{ position: 'relative' }}>
        <header
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '2px solid #1a3d7c',
              marginBottom: '1rem',
              gap: '1rem',
            }}
        >
          <img
              src={mjuLogo}
              alt="명지대 로고"
              style={{ height: '40px', objectFit: 'contain' }}
          />
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a3d7c', fontWeight: '700' }}>
            명지대 학생식당
          </h1>
        </header>

        <button
            onClick={() => setViewMode(viewMode === 'week' ? 'calendar' : 'week')}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#e6efff',
              zIndex: 10,
            }}
        >
          {viewMode === 'week' ? '📅 달력으로 보기' : '📋 주간 식단표로 보기'}
        </button>

        {isLoading ? (
            <div>식단 불러오는 중...</div>
        ) : viewMode === 'week' ? (
            <MealTableContainer mealMenus={mealMenus} />
        ) : (
            <CalendarView mealMenus={mealMenus} />
        )}
      </div>
  );
}
