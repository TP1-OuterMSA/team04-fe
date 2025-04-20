import { useEffect, useState } from 'react';
import { MealMenu } from '../types/meal';
import { MealMenuFetcher } from '../services/MealMenuFetcher';

export const useMealData = (): MealMenu[] => {
    const [mealMenus, setMealMenus] = useState<MealMenu[]>([]);

    useEffect(() => {
        const fetcher = new MealMenuFetcher();

        fetcher.fetch().then((menus) => {
            setMealMenus(menus);
        });
    }, []);

    return mealMenus;
};