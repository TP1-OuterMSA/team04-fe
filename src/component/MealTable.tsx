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
    const dayLabels = menuList.extractDayLabels();
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

export default MealTable;