import React from 'react';
import { MealMenu } from '../types/meal';
import { MealMenuList } from '../collections/MealMenuList';
import { DayLabel } from '../valueobjects/DayLabel';
import { MealType } from '../valueobjects/MealType';

interface MealTableProps {
    mealMenu: MealMenu[];
}

export const MealTable: React.FC<MealTableProps> = ({ mealMenu }) => {
    const menuList = new MealMenuList(mealMenu);
    const dayLabels = generateFixedWeekLabels(mealMenu);
    const mealTypes = menuList.extractMealTypes();

    return (
        <table className="table">
            <thead>
            <tr>
                <th>식사/날짜</th>
                {dayLabels.map((dayLabel) => (
                    <th key={dayLabel.value()}>{dayLabel.value()}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {mealTypes.map((mealType) => (
                <MealTableRow
                    key={mealType.value()}
                    mealType={mealType}
                    dayLabels={dayLabels}
                    menuList={menuList}
                />
            ))}
            </tbody>
        </table>
    );
};

interface MealTableRowProps {
    mealType: MealType;
    dayLabels: DayLabel[];
    menuList: MealMenuList;
}

const MealTableRow: React.FC<MealTableRowProps> = ({ mealType, dayLabels, menuList }) => {
    const cells = dayLabels.map((dayLabel) => {
        const content = menuList.findMenu(mealType, dayLabel);
        const lines = content.value().split(/\s+/);

        return (
            <td key={dayLabel.value()}>
                {lines.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </td>
        );
    });

    return (
        <tr>
            <td><strong>{mealType.value()}</strong></td>
            {cells}
        </tr>
    );
};

// ✅ 월~금 날짜 고정 유틸 함수
const generateFixedWeekLabels = (menus: MealMenu[]): DayLabel[] => {
    if (menus.length === 0) return [];

    const dates = menus.map((m) => new Date(m.date));
    const monday = new Date(Math.min(...dates.map((d) => d.getTime())));
    const day = monday.getDay();
    monday.setDate(monday.getDate() - ((day + 6) % 7)); // 월요일로 보정

    const labels: DayLabel[] = [];

    for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const formatted = `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d
            .getDate()
            .toString()
            .padStart(2, '0')}`;
        labels.push(new DayLabel(formatted));
    }

    return labels;
};

export default MealTable;
