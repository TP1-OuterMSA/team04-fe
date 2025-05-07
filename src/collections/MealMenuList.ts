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
        // ✅ 안정적으로 날짜를 파싱하기 위해 UTC 시간 기준으로 고정
        const date = new Date(dateString + 'T00:00:00');
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
    }

    public extractDayLabels(): DayLabel[] {
        const rawDates = this.menus.map(menu => menu.date); // 예: "2025-05-02"
        const uniqueDates = Array.from(new Set(rawDates));

        // ✅ 날짜 정렬 (Date 객체를 기준으로 정확히 정렬)
        uniqueDates.sort((a, b) => new Date(a + 'T00:00:00').getTime() - new Date(b + 'T00:00:00').getTime());

        return uniqueDates.map(date => new DayLabel(this.formatDay(date)));
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
