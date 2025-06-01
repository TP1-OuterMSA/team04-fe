


import React, {useState} from 'react';
import {MealMenu} from '../../types/meal.ts';
import {API_ENDPOINTS} from '../../config/api.ts';
import NutritionModal from '../nutrition/NutritionModal.tsx';
import './MealTable.css';

interface CompleteMenuData {
  date: string;
  menus: MealMenu[];
}

interface MealTableProps {
  completeMenus: CompleteMenuData[];
  highlightKeyword: string;
}

const MealTable: React.FC<MealTableProps> = ({completeMenus, highlightKeyword}) => {
  const [nutritionInfo, setNutritionInfo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // completeMenus에서 날짜와 식사 타입 추출
  const dates = completeMenus.map(item => item.date);
  const allMealTypes = completeMenus.flatMap(item =>
      item.menus.map(menu => menu.mealType)
  );
  const mealTypes = [...new Set(allMealTypes)];

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
                {completeMenus.map(({date, menus}) => {
                  const menu = menus.find(m => m.mealType === mealType);
                  const categoryOrder = ['RICE', 'NOODLE', 'MAIN', 'SIDE', 'DESSERT', 'SOUP'];

                  let categoryMap: Record<string, string[]> = {};

                  if (menu && menu.meals) {
                    menu.meals.forEach(meal => {
                      if (!categoryMap[meal.mealCategory]) {
                        categoryMap[meal.mealCategory] = [];
                      }
                      categoryMap[meal.mealCategory].push(meal.mealName);
                    });
                  }

                  return (
                      <td key={`${date}-${mealType}`}>
                        {menu && menu.meals && menu.meals.length > 0 ? (
                            categoryOrder.map(category => {
                              const items = categoryMap[category] || [];

                              return (
                                  <div key={category} className="category-row">
                                    <div
                                        className="category-name">{categoryNameMap[category] || category}</div>
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
                            })
                        ) : (
                            <div className="no-meal-message">식단 정보 없음</div>
                        )}
                      </td>

                  );
                })}
              </tr>
          ))}
          </tbody>
        </table>

        {showModal && nutritionInfo && (
            <NutritionModal nutritionInfo={nutritionInfo} onClose={closeModal}/>
        )}
      </>
  );
};

export default MealTable;

