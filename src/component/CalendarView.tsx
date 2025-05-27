import React, { useState } from 'react';
import { MealMenu } from '../types/meal';
import MealPopup from './MealPopup';

interface Props {
    mealMenus: MealMenu[];
}

const CalendarView: React.FC<Props> = ({ mealMenus }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // 1~12

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
    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // 요일 보정: 월=0, ..., 일=6

    const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

    return (
        <div>
            {/* 제목 */}
            <h2 style={{
                textAlign: 'center',
                margin: '2rem 0 1rem',
                fontSize: '1.5rem'
            }}>
                {title}
            </h2>

            {/* 요일 헤더 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                maxWidth: '960px',
                margin: '0 auto',
                marginTop: '1rem',
                fontWeight: 'bold',
                color: '#1a3d7c',
                textAlign: 'center',
            }}>
                {weekDays.map((day, idx) => (
                    <div key={idx} style={{ padding: '0.5rem 0' }}>{day}</div>
                ))}
            </div>

            {/* 날짜 셀 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
                padding: '1rem',
                maxWidth: '960px',
                margin: '0 auto',
                minHeight: '600px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
            }}>
                {/* 1일 전까지 빈 칸 채우기 */}
                {Array(startDay).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* 날짜 버튼 */}
                {dateStringsInMonth.map(date => {
                    const day = new Date(date).getDate();
                    const hasMenu = hasMenuForDate(date);

                    return (
                        <button
                            key={date}
                            onClick={() => hasMenu && openPopup(date)}
                            disabled={!hasMenu}
                            style={{
                                padding: '18px 0',
                                backgroundColor: hasMenu ? '#ffffff' : '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: hasMenu ? 'pointer' : 'not-allowed',
                                fontSize: '1rem',
                                height: '80px',
                                color: hasMenu ? '#000' : '#888',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {/* 월 이동 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
                <button
                    onClick={() => changeMonth(-1)}
                    disabled={month <= 1}
                    style={{
                        padding: '0.5rem 1rem',
                        cursor: month > 1 ? 'pointer' : 'not-allowed',
                        opacity: month > 1 ? 1 : 0.5,
                    }}
                >
                    이전 달
                </button>
                <button
                    onClick={() => changeMonth(1)}
                    disabled={month >= 12}
                    style={{
                        padding: '0.5rem 1rem',
                        cursor: month < 12 ? 'pointer' : 'not-allowed',
                        opacity: month < 12 ? 1 : 0.5,
                    }}
                >
                    다음 달
                </button>
            </div>

            {/* 팝업 */}
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
