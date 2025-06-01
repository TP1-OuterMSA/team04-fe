import React, { useState } from 'react';
import { MealMenu } from '../../types/meal';
import { API_ENDPOINTS } from '../../config/api';
import NutritionModal from '../nutrition/NutritionModal.tsx';
import './MealPopup.css';

interface MealPopupProps {
  date: string;
  meals: MealMenu[];
  onClose: () => void;
}

const MealPopup: React.FC<MealPopupProps> = ({ date, meals, onClose }) => {
  const [nutritionInfo, setNutritionInfo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const mealTypeLabels: Record<string, string> = {
    breakfast: '🕗 조식',
    lunch: '🍱 중식',
    dinner: '🌙 석식',
  };

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

  const closeNutritionModal = () => {
    setNutritionInfo(null);
    setShowModal(false);
  };

  return (
      <div className="meal-popup-overlay">
        <div className="meal-popup">
          <div className="popup-close-wrapper">
            <button className="popup-close-btn" onClick={onClose}>×</button>
          </div>

          <h2 className="popup-title">{date} 식단</h2>

          {meals.length === 0 ? (
              <p className="popup-no-data">식단 정보가 없습니다.</p>
          ) : (
              <div className="popup-meal-list">
                {meals.map((meal, idx) => (
                    <div key={idx} className="popup-meal-item">
                      <strong className="popup-meal-type">
                        {mealTypeLabels[meal.mealType] || meal.mealType}
                      </strong>
                      <ul className="popup-meal-menu">
                        {meal.menuContent.split(/\s+/).filter(Boolean).map((item, i) => (
                            <li key={i} className="popup-meal-menu-item">
                              <span>{item}</span>
                              <button
                                  onClick={() => fetchNutrition(item)}
                                  className="popup-nutrition-btn"
                                  title="영양 정보 보기"
                              >
                                ℹ️
                              </button>
                            </li>
                        ))}
                      </ul>
                    </div>
                ))}
              </div>
          )}

          {showModal && nutritionInfo && (
              <NutritionModal nutritionInfo={nutritionInfo} onClose={closeNutritionModal} />
          )}
        </div>
      </div>
  );
};

export default MealPopup;
