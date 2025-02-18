import { getAllPlannings } from '@/app/actions/planning';

export async function fetchPlanning() {
  try {
    const response = await getAllPlannings();
    return response
  } catch (error) {
    console.error(error);
    
  }
}
