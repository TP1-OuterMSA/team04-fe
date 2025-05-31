import React from 'react';
import ReactDOM from 'react-dom';

interface NutritionModalProps {
  nutritionInfo: any;
  onClose: () => void;
}

const NutritionModal: React.FC<NutritionModalProps> = ({ nutritionInfo, onClose }) => {
  console.log('NutritionModal 렌더링됨:', nutritionInfo);

  return ReactDOM.createPortal(
      <div
          className="nutrition-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={onClose}
      >
        <div
            className="nutrition-modal"
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              width: '400px',
              position: 'relative',
              fontFamily: 'Arial, sans-serif',
              fontSize: '13px'
            }}
            onClick={(e) => e.stopPropagation()}
        >
          <div
              className="close-button"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#666'
              }}
          >
            ×
          </div>

          <h2
              className="modal-title"
              style={{
                marginTop: 0,
                textAlign: 'center',
                fontSize: '16px',
                paddingBottom: '0.5rem'
              }}
          >
            {nutritionInfo?.foodName || nutritionInfo?.food_name || '음식'} 영양 정보
          </h2>

          <hr />

          <table
              className="nutrition-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}
          >
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
                  <td
                      className="label-cell"
                      style={{
                        border: '1px solid #ccc',
                        padding: '6px 10px',
                        fontWeight: 'bold',
                        background: '#f9f9f9',
                        width: '40%'
                      }}
                  >
                    {label}
                  </td>
                  <td
                      className="value-cell"
                      style={{
                        border: '1px solid #ccc',
                        padding: '6px 10px'
                      }}
                  >
                    {value}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>,
      document.body
  );
};

export default NutritionModal;