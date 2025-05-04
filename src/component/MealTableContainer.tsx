import React, { useMemo, useState } from 'react';
import { useMealData } from '../hooks/useMealData';
import MealTable from '../component/MealTable';
import { MealMenu } from '../types/meal';

const MealTableContainer: React.FC = () => {
    const { mealMenus, isLoading } = useMealData(); // ✅ 로딩 상태 포함
    const [baseDate, setBaseDate] = useState(new Date());

    const formatDate = (date: Date): string =>
        `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;

    const { monday, friday, dateRange } = useMemo(() => {
        const dayOfWeek = baseDate.getDay();
        const monday = new Date(baseDate);
        const friday = new Date(baseDate);
        monday.setDate(baseDate.getDate() - (dayOfWeek - 1));
        friday.setDate(monday.getDate() + 4);
        return {
            monday,
            friday,
            dateRange: `${formatDate(monday)} ~ ${formatDate(friday)}`,
        };
    }, [baseDate]);

    const getWeekNumber = (date: Date): number => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 월요일 기준
        const adjustedDate = date.getDate() + dayOffset;
        return Math.ceil(adjustedDate / 7);
    };

    const title = `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월 ${getWeekNumber(baseDate)}주차 식단표`;

    const filterMenusInRange = (start: Date, end: Date): MealMenu[] => {
        return mealMenus.filter((menu) => {
            const date = new Date(menu.date);
            return date >= start && date <= end;
        });
    };

    const thisWeekMenus = useMemo(() => filterMenusInRange(monday, friday), [mealMenus, monday, friday]);

    const hasPreviousWeek = useMemo(() => {
        const prevMonday = new Date(monday);
        const prevFriday = new Date(friday);
        prevMonday.setDate(prevMonday.getDate() - 7);
        prevFriday.setDate(prevFriday.getDate() - 7);
        return filterMenusInRange(prevMonday, prevFriday).length > 0;
    }, [mealMenus, monday, friday]);

    const hasNextWeek = useMemo(() => {
        const nextMonday = new Date(monday);
        const nextFriday = new Date(friday);
        nextMonday.setDate(nextMonday.getDate() + 7);
        nextFriday.setDate(nextFriday.getDate() + 7);
        return filterMenusInRange(nextMonday, nextFriday).length > 0;
    }, [mealMenus, monday, friday]);

    return (
        <div className="container">
            <h1>{title} ({dateRange})</h1>

            {/* ✅ 로딩 중일 때는 아무것도 렌더링하지 않음 */}
            {isLoading ? null : (
                <div style={{ minHeight: '600px' }}>
                    {thisWeekMenus.length > 0 ? (
                        <MealTable mealMenu={thisWeekMenus} />
                    ) : (
                        <p style={{ marginTop: '2rem' }}>해당 주차의 식단 정보가 없습니다.</p>
                    )}
                </div>
            )}

            {/* ✅ 버튼은 항상 렌더링 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
                <button
                    onClick={() =>
                        setBaseDate((prev) => {
                            const copy = new Date(prev);
                            copy.setDate(copy.getDate() - 7);
                            return copy;
                        })
                    }
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
                    onClick={() =>
                        setBaseDate((prev) => {
                            const copy = new Date(prev);
                            copy.setDate(copy.getDate() + 7);
                            return copy;
                        })
                    }
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

export default MealTableContainer;
