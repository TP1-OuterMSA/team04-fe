import React, { useState } from 'react';
import { MealMenu } from '../../types/meal';
import MealTable from './MealTable';
import './MealTableContainer.css';

interface MealTableContainerProps {
  mealMenus: MealMenu[];
}

const MealTableContainer: React.FC<MealTableContainerProps> = ({ mealMenus }) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const [highlightKeyword, setHighlightKeyword] = useState('');

  const getCurrentWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1 + weekIndex * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  const filteredMenus = mealMenus.filter(menu => {
    const menuDate = formatDate(new Date(menu.date));
    const { start, end } = getCurrentWeek();
    return menuDate >= start && menuDate <= end;
  });

  const handlePrevWeek = () => setWeekIndex(prev => prev - 1);
  const handleNextWeek = () => setWeekIndex(prev => prev + 1);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightKeyword(e.target.value.trim());
  };

  return (
      <div className="container">
        <div className="week-header">
          <button className="week-nav-button" onClick={handlePrevWeek}>이전 주</button>
          <h1>{getCurrentWeek().start} ~ {getCurrentWeek().end}</h1>
          <button className="week-nav-button" onClick={handleNextWeek}>다음 주</button>
        </div>

        <input
            type="text"
            placeholder="음식명 검색..."
            value={highlightKeyword}
            onChange={handleSearchChange}
            className="search-input"
        />

        <MealTable mealMenus={filteredMenus} highlightKeyword={highlightKeyword} />
      </div>
  );
};

function formatDate(date: Date): string {
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
}

export default MealTableContainer;
