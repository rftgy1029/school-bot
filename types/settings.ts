export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type SchoolSettings = {
  schoolName: string;
  educationOfficeCode: string;
  schoolCode: string;
  grade: string;
  classNumber: string;
  mealType: MealType;
};
