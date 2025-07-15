import { getToken } from './storage';

const API_BASE_URL = 'http://localhost:8000/api';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  state: 'pending' | 'current' | 'completed';
  completedSets?: number;
  notes?: string;
}

interface Workout {
  _id: string;
  name: string;
  description?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  exercises: Exercise[];
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  caloriesBurned?: number;
  averageHeartRate?: number;
  notes?: string;
}

export const workoutApi = {
  async getUserWorkouts(userId: string, date?: string): Promise<Workout[]> {
    const token = await getToken();
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    return response.json();
  },

  async updateWorkoutExercise(workoutId: string, exerciseId: string, updates: {
    state?: 'pending' | 'current' | 'completed';
    completedSets?: number;
    notes?: string;
  }): Promise<Workout> {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}/exercise`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId,
        ...updates,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update workout exercise');
    }

    return response.json();
  },

  async updateWorkoutStats(workoutId: string, stats: {
    caloriesBurned?: number;
    averageHeartRate?: number;
    notes?: string;
  }): Promise<Workout> {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}/stats`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error('Failed to update workout stats');
    }

    return response.json();
  },
}; 