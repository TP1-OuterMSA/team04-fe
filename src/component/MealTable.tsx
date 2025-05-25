import React, {useState} from 'react';
import {MealMenu} from '../types/meal';
import {API_ENDPOINTS} from '../config/api';

interface MealTableProps {
  mealMenus: MealMenu[];
}

const MealTable: React.FC<MealTableProps> = ({mealMenus}) => {
  const [nutritionInfo, setNutritionInfo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);


  const dates = [...new Set(mealMenus.map(menu => formatDate(menu.date)))].sort();
  const mealTypes = [...new Set(mealMenus.map(menu => menu.mealType))];

  const fetchNutrition = async (foodName: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.MEAL_NUTRITION}?foodName=${foodName}`);
      if (!res.ok) throw new Error('정보를 불러올 수 없습니다.');
      const data = await res.json();
      console.log('영양 정보 데이터:', data); // 데이터 구조 확인용 로그
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


  const findMenuContent = (date: string, mealType: string): string => {
    const menu = mealMenus.find(
        menu => formatDate(menu.date) === date && menu.mealType === mealType
    );
    return menu?.menuContent || '';
  };

  return (
      <>
        <table className="table">
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
                <td><strong>{mealType}</strong></td>
                {dates.map(date => {
                  const content = findMenuContent(date, mealType);
                  const foods = content.split(/\s+/).filter(Boolean);

                  return (
                      <td key={`${date}-${mealType}`}>
                        {foods.map((food, idx) => (
                            <div
                                key={idx}
                                onClick={() => fetchNutrition(food)}
                                style={{cursor: 'pointer', color: 'black'}}
                            >
                              {food}
                            </div>
                        ))}
                      </td>
                  );
                })}
              </tr>
          ))}
          </tbody>
        </table>
        {showModal && nutritionInfo && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '1.5rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              zIndex: 1000,
              width: '400px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '13px'
            }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#666'
              }} onClick={closeModal}>
                ×
              </div>

              <h2 style={{
                marginTop: 0,
                textAlign: 'center',
                fontSize: '16px',
                paddingBottom: '0.5rem'
              }}>
                {nutritionInfo?.foodName || nutritionInfo?.food_name || '음식'} 영양 정보
              </h2>

              <hr style={{margin: '0.8rem 0'}} />

              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>
                <tbody>
                {[
                  ['음식 종류', nutritionInfo?.mealCategory || '정보 없음'],
                  ['칼로리', `${nutritionInfo?.calorie_kcal || 0} kcal`],
                  ['탄수화물', `${nutritionInfo?.carb_g || 0} g`],
                  ['단백질', `${nutritionInfo?.protein_g || 0} g`],
                  ['지방', `${nutritionInfo?.fat_g || 0} g`],
                  ['음식량', nutritionInfo?.foodWeight || '정보 없음'],
                  ['알러지', nutritionInfo?.allergy || '없음'],
                ].map(([label, value], idx) => (
                    <tr key={idx}>
                      <td style={{
                        border: '1px solid #ccc',
                        padding: '6px 10px',
                        fontWeight: 'bold',
                        background: '#f9f9f9',
                        width: '40%'
                      }}>{label}</td>
                      <td style={{
                        border: '1px solid #ccc',
                        padding: '6px 10px'
                      }}>{value}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
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