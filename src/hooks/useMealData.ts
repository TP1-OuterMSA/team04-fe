import { useEffect, useState } from 'react';
import { MealMenu } from '../types/meal';
import { MealMenuFetcher } from '../services/MealMenuFetcher';

export const useMealData = (): { mealMenus: MealMenu[]; isLoading: boolean } => {
    const [mealMenus, setMealMenus] = useState<MealMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetcher = new MealMenuFetcher();

        fetcher.fetch().then((menus) => {
            setMealMenus(menus);
            setIsLoading(false);
        });
    }, []);

    return { mealMenus, isLoading };
};
