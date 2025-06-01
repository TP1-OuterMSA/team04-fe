import React, { useState } from 'react';
import { MealMenu } from '../../types/meal.ts';
import { API_ENDPOINTS } from '../../config/api.ts';
import NutritionModal from '../nutrition/NutritionModal.tsx';
import './MealTable.css';  // 여기 추가

interface MealTableProps {
  mealMenus: MealMenu[];
  highlightKeyword: string;
}

const MealTable: React.FC<MealTableProps> = ({ mealMenus, highlightKeyword }) => {
  const [nutritionInfo, setNutritionInfo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const dates = [...new Set(mealMenus.map(menu => formatDate(menu.date)))].sort();
  const mealTypes = [...new Set(mealMenus.map(menu => menu.mealType))];

  const fetchNutrition = async (foodName: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.MEAL_NUTRITION}?foodName=${foodName}`);
      if (!res.ok) throw new Error('정보를 불러올 수 없습니다.');
      const data = await res.json();
      setNutritionInfo(data);
      setShowModal(true);
    } catch (error) {
      console.error('영양 정보 요청 실패:', error);
      alert('영양 정보 요청 실패: ' + error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNutritionInfo(null);
  };

  const mealTypeMap: Record<string, string> = {
    breakfast: '조식',
    lunch: '중식',
    dinner: '석식',
  };

  const categoryNameMap: Record<string, string> = {
    RICE: '밥류',
    NOODLE: '면류',
    MAIN: '주요리',
    SIDE: '반찬',
    DESSERT: '후식',
    SOUP: '국/찌개',
  };

  return (
      <>
        <table className="meal-table">
          <thead>
          <tr>
            <th>식사/날짜</th>
            {dates.map(date => (
                <th key={date}>{date}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {mealTypes.map(mealType => (
              <tr key={mealType}>
                <td className="meal-type-cell">
                  <strong>{mealTypeMap[mealType] || mealType}</strong>
                </td>
                {dates.map(date => {
                  const menu = mealMenus.find(
                      m => formatDate(m.date) === date && m.mealType === mealType
                  );

                  if (!menu || !menu.meals) return <td key={`${date}-${mealType}`}></td>;

                  const categoryOrder = ['RICE', 'NOODLE', 'MAIN', 'SIDE', 'DESSERT', 'SOUP'];

                  const categoryMap: Record<string, string[]> = {};
                  menu.meals.forEach(meal => {
                    if (!categoryMap[meal.mealCategory]) {
                      categoryMap[meal.mealCategory] = [];
                    }
                    categoryMap[meal.mealCategory].push(meal.mealName);
                  });

                  return (
                      <td key={`${date}-${mealType}`}>
                        {categoryOrder.map(category => {
                          const items = categoryMap[category] || [];

                          return (
                              <div className="category-row">
                                <div className="category-name">{categoryNameMap[category] || category}</div>
                                <div className="food-list">
                                  {items.length > 0 ? (
                                      items.map((food, idx) => {
                                        const isHighlighted = highlightKeyword && food.includes(highlightKeyword);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => fetchNutrition(food)}
                                                className={`food-item${isHighlighted ? ' highlighted' : ''}`}
                                            >
                                              {food}
                                            </div>
                                        );
                                      })
                                  ) : (
                                      <div className="no-food">-</div>
                                  )}
                                </div>
                              </div>
                          );
                        })}
                      </td>
                  );
                })}
              </tr>
          ))}
          </tbody>
        </table>

        {showModal && nutritionInfo && (
            <NutritionModal nutritionInfo={nutritionInfo} onClose={closeModal} />
        )}
      </>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
  .getDate()
  .toString()
  .padStart(2, '0')}`;
}

export default MealTable;
