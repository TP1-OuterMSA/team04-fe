import { MealMenu } from '../types/meal';
import { DayLabel } from '../valueobjects/DayLabel';
import { MealType } from '../valueobjects/MealType';
import { MenuContent } from '../valueobjects/MenuContent';

export class MealMenuList {
    private readonly menus: MealMenu[];

    constructor(menus: MealMenu[]) {
        this.menus = menus;
    }

    private formatDay(dateString: string): string {
        const [year, month, date] = dateString.split('-'); // "2025-05-02" → ["2025", "05", "02"]
        return `${year}.${month.padStart(2, '0')}.${date.padStart(2, '0')}`;
    }


    public extractDayLabels(): DayLabel[] {
        const labels = this.menus.map(menu => this.formatDay(menu.date));
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
            this.formatDay(menu.date) === dayLabel.value()
        );

        if (!match) {
            return new MenuContent('');
        }

        return new MenuContent(match.menuContent);
    }

}
