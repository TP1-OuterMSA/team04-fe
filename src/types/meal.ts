export interface MealMenu {
    menuId: number;
    date: string;
    mealType: string;
    menuTitle: string;
    menuContent: string;
    extraInfo: string;
    meals: {
        mealName: string;
        mealCategory: string;
    }[];
}
