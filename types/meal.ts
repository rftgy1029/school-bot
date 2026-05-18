import type { MealType } from './settings';

export type Meal = {
  date: string;
  mealType: MealType;
  menuItems: string[];
  calorie?: string;
  nutrition?: string;
  origin?: string;
  allergyNumbers?: string[];
};
