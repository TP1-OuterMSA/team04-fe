import { MealMenu } from '../types/meal';

interface Props {
    date: string;
    meals: MealMenu[];
    onClose: () => void;
}

export default function MealPopup({ date, meals, onClose }: Props) {
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '2rem', margin: '5% auto',
                width: '90%', maxWidth: '500px', borderRadius: '8px', position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'none', border: 'none', fontSize: '20px'
                }}>×</button>

                <h3>{date} 식단 정보</h3>
                <ul>
                    {mealTypes.map(type => {
                        const meal = meals.find(m => m.mealType === type);
                        return (
                            <li key={type}>
                                <strong>{type}</strong>: {meal?.menuContent || '없음'}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
