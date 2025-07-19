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
  // Trainer-specific fields (for PTs)
  bio?: string;
  instagram?: string;
  services?: Array<{
    name: string;
    description: string;
    price: string;
    isPopular?: boolean;
  }>;
  stats?: {
    clientsCoached: string;
    yearsExperience: number;
    rating: number;
    certifications: number;
  };
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

// Updated Trainer interface to match User model with role: "pt"
export interface Trainer {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  image?: string;
  profilePicture?: string;
  bio: string;
  instagram?: string;
  services?: Array<{
    name: string;
    description: string;
    price: string;
    isPopular?: boolean;
  }>;
  stats?: {
    clientsCoached: string;
    yearsExperience: number;
    rating: number;
    certifications: number;
  };
}

export const homeApi = {
  // Get workouts for a specific week (optimized approach)
  async getWeekWorkouts(userId: string, startDate: string, endDate: string): Promise<{
    workouts: Workout[];
    workoutDates: string[];
  }> {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch week workouts');
      }

      const workouts = await response.json();
      
      // Extract unique dates that have scheduled workouts
      const workoutDates: string[] = [...new Set(
        workouts
          .filter((workout: Workout) => workout.status === 'scheduled')
          .map((workout: Workout) => workout.scheduledDate.split('T')[0]) // Get YYYY-MM-DD part
      )] as string[];
      
      console.log('📅 Week workouts fetched:', workouts.length, 'workouts');
      console.log('📅 Workout dates for calendar:', workoutDates);
      
      return { workouts, workoutDates };
    } catch (error) {
      console.error('Error fetching week workouts:', error);
      return { workouts: [], workoutDates: [] };
    }
  },

  // Get workout for a specific date (from cached week data)
  getWorkoutForDate(workouts: Workout[], date: string): Workout | null {
    console.log('🔍 getWorkoutForDate called with date:', date);
    console.log('🔍 Available workouts:', workouts.map(w => ({ 
      name: w.name, 
      scheduledDate: w.scheduledDate, 
      dateOnly: w.scheduledDate.split('T')[0],
      status: w.status 
    })));
    
    const dateString = date; // date is already in YYYY-MM-DD format
    const foundWorkout = workouts.find((workout: Workout) => {
      const workoutDate = workout.scheduledDate.split('T')[0]; // Get YYYY-MM-DD part
      const matches = workoutDate === dateString && workout.status === 'scheduled';
      console.log(`🔍 Comparing ${workoutDate} with ${dateString}, status: ${workout.status}, matches: ${matches}`);
      return matches;
    });
    
    console.log('🔍 Found workout:', foundWorkout ? foundWorkout.name : 'null');
    return foundWorkout || null;
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
      
      // Transform User model data to match Trainer interface
      const transformedTrainers = trainers.map((trainer: any) => ({
        _id: trainer._id,
        name: trainer.name || `${trainer.firstName} ${trainer.lastName}`,
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        image: trainer.profilePicture || trainer.image,
        profilePicture: trainer.profilePicture,
        bio: trainer.bio || 'Personal Trainer',
        instagram: trainer.instagram,
        services: trainer.services || [],
        stats: trainer.stats || {
          clientsCoached: '0',
          yearsExperience: 0,
          rating: 4.5, // Default rating
          certifications: 0
        }
      }));
      
      // Sort by rating and return top 3
      return transformedTrainers
        .sort((a: Trainer, b: Trainer) => (b.stats?.rating || 0) - (a.stats?.rating || 0))
        .slice(0, 3);
    } catch (error) {
      console.error('Error fetching suggested trainers:', error);
      return [];
    }
  }
}; 