import { getToken } from './storage';

const API_BASE_URL = 'http://localhost:8000/api';

// Match your backend User model exactly
export interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Virtual property
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  fitnessGoal?: "lose_weight" | "build_muscle" | "stay_fit" | "endurance" | "flexibility";
  workoutFrequency?: number;
  profilePicture?: string;
  role: "trainee" | "pt";
  trainees?: string[];
  personalTrainer?: string;
  createdAt: string;
  updatedAt: string;
}

// Match your backend Workout model exactly
export interface Workout {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  muscleGroups: string[];
  exercises: Array<{
    exerciseId: string;
    name: string;
    sets: number;
    reps: string;
    state: "pending" | "current" | "completed";
    completedSets?: number;
    notes?: string;
  }>;
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  caloriesBurned?: number;
  averageHeartRate?: number;
  notes?: string;
  trainerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Match your backend Trainer model exactly
export interface Trainer {
  _id: string;
  name: string;
  image: string;
  bio: string;
  instagram?: string;
  services: Array<{
    name: string;
    description: string;
    price: string;
    isPopular?: boolean;
  }>;
  stats: {
    clientsCoached: string;
    yearsExperience: number;
    rating: number;
    certifications: number;
  };
}

export const homeApi = {
  // Get today's workout for the user
  async getTodayWorkout(userId: string): Promise<Workout | null> {
    try {
      const token = await getToken();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch today\'s workout');
      }

      const workouts = await response.json();
      // Return the first scheduled workout for today
      return workouts.find((workout: Workout) => workout.status === 'scheduled') || null;
    } catch (error) {
      console.error('Error fetching today\'s workout:', error);
      return null;
    }
  },

  // Get suggested trainers (top rated trainers)
  async getSuggestedTrainers(): Promise<Trainer[]> {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/trainers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested trainers');
      }

      const data = await response.json();
      // Your backend returns { trainers: [...] }
      const trainers = data.trainers || [];
      // Sort by rating and return top 3
      return trainers
        .sort((a: Trainer, b: Trainer) => b.stats.rating - a.stats.rating)
        .slice(0, 3);
    } catch (error) {
      console.error('Error fetching suggested trainers:', error);
      return [];
    }
  }
}; 