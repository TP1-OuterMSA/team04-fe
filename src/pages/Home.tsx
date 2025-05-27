import { useState, useEffect } from 'react';
import MealTableContainer from '../component/MealTableContainer';
import CalendarView from '../component/CalendarView';
import { MealMenu } from '../types/meal';
import { MealMenuFetcher } from '../services/MealMenuFetcher';

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
        <div className="container">
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '1.5rem'
            }}>
                <button
                    onClick={() => setViewMode(viewMode === 'week' ? 'calendar' : 'week')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        backgroundColor: '#e6efff'
                    }}
                >
                    {viewMode === 'week' ? '📅 달력으로 보기' : '📋 주간 식단표로 보기'}
                </button>
            </div>

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
