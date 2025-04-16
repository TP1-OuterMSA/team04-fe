import { MealMenu } from '../types/meal';
import { API_ENDPOINTS } from '../config/api';

export class MealMenuFetcher {
    private readonly endpoint: string;

    constructor() {
        this.endpoint = API_ENDPOINTS.MEAL_MENU;
    }

    public async fetch(): Promise<MealMenu[]> {
        const response = await fetch(this.endpoint);
        const data = await response.json();

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data.mealMenu)) {
            return data.mealMenu;
        }

        return [];
    }
}
