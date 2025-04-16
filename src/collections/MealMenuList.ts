import { MealMenu } from '../types/meal';
import { DayLabel } from '../valueobjects/DayLabel';
import { MealType } from '../valueobjects/MealType';
import { MenuContent } from '../valueobjects/MenuContent';

export class MealMenuList {
    private readonly menus: MealMenu[];

    constructor(menus: MealMenu[]) {
        this.menus = menus;
    }

    public extractDayLabels(): DayLabel[] {
        const labels = this.menus.map(menu => menu.day);
        const uniqueLabels = Array.from(new Set(labels));
        return uniqueLabels.map(label => new DayLabel(label));
    }

    public extractMealTypes(): MealType[] {
        const types = this.menus.map(menu => menu.mealType);
        const uniqueTypes = Array.from(new Set(types));
        return uniqueTypes.map(type => new MealType(type));
    }

    public findMenu(mealType: MealType, dayLabel: DayLabel): MenuContent {
        const match = this.menus.find(menu =>
            menu.mealType === mealType.value() &&
            menu.day === dayLabel.value()
        );

        if (!match) {
            return new MenuContent('');
        }

        return new MenuContent(match.menuContent);
    }
}
