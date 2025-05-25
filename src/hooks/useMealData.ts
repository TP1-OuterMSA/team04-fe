import { useEffect, useState } from 'react';
import { MealMenu } from '../types/meal';
import { MealMenuFetcher } from '../services/MealMenuFetcher';

export const useMealData = () => {
    const [mealMenus, setMealMenus] = useState<MealMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        new MealMenuFetcher().fetch().then((menus) => {
            setMealMenus(menus);
            setIsLoading(false);
        });
    }, []);

    return { mealMenus, isLoading };
};
