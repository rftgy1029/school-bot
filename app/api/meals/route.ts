import { NextResponse } from 'next/server';
import { sampleMeals } from '@/lib/sample-data';

export async function GET() {
  return NextResponse.json({ meals: sampleMeals });
}
