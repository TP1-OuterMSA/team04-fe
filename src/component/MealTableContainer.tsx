import React, { useMemo } from 'react';
import { useMealData } from '../hooks/useMealData';
import MealTable from '../component/MealTable';

const MealTableContainer: React.FC = () => {
    const mealMenu = useMealData();

    const dateRange = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        const friday = new Date(today);

        monday.setDate(today.getDate() - (dayOfWeek - 1));
        friday.setDate(monday.getDate() + 4);

        const formatDate = (date: Date) =>
            `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
                .getDate()
                .toString()
                .padStart(2, '0')}`;

        return `${formatDate(monday)} ~ ${formatDate(friday)}`;
    }, []);

    if (mealMenu.length === 0) {
        return null;
    }

    return (
        <div className="container">
            <h1>이번 주 식단표 ({dateRange})</h1>
            <MealTable mealMenu={mealMenu} />
        </div>
    );
};

export default MealTableContainer;
