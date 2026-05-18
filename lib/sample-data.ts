import type { Meal } from '@/types/meal';

export const sampleMeals: Meal[] = [
  {
    date: '오늘',
    mealType: 'lunch',
    menuItems: ['쌀밥', '미역국', '제육볶음', '계란말이', '배추김치'],
    calorie: '827.3 Kcal',
    allergyNumbers: ['1', '5', '6'],
  },
  {
    date: '내일',
    mealType: 'lunch',
    menuItems: ['김치볶음밥', '유부장국', '치킨너겟', '깍두기', '요구르트'],
    calorie: '791.8 Kcal',
    allergyNumbers: ['2', '5', '6', '10'],
  },
];
