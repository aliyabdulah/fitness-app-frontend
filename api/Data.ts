import axios from "axios";
import { getToken } from "./storage";
import Constants from "expo-constants";

const { manifest } = Constants;
const getApiUrl = () => {
  // Use your local IP for mobile, localhost for web
  if (manifest && manifest.debuggerHost) {
    const localIP = manifest.debuggerHost.split(":").shift();
    return `http://${localIP}:8000/`;
  }
  return "http://localhost:8000/";
};

export const api = axios.create({
  baseURL: getApiUrl(),
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Profile Functions
export const getProfile = () => api.get("/api/user/profile");

export const updateProfile = (profileData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: string;
  fitnessGoal?: string;
  workoutFrequency?: number;
  image?: string;
}) => api.put("/api/user/profile", profileData);

// Workout Functions
export const getWorkouts = () => api.get("/api/workouts/my");

export const createWorkout = async (workoutData: {
  name: string;
  type: string;
  duration: number;
  calories: number;
  exercises: any[];
  date?: string;
}) => {
  const { data } = await api.post("/api/workouts", workoutData);
  return data;
};

export const getWorkoutById = (workoutId: string) =>
  api.get(`/api/workouts/${workoutId}`);

export const deleteWorkout = (workoutId: string) =>
  api.delete(`/api/workouts/${workoutId}`);

// Trainer Functions
export const getAllTrainers = () => api.get("/api/trainers");
export const getTrainerById = (id: string) => api.get(`/api/trainers/${id}`);

export const bookTrainer = async (
  trainerId: string,
  sessionData: {
    date: string;
    time: string;
    duration: number;
    sessionType: string;
  }
) => {
  const { data } = await api.post(
    `/api/trainers/${trainerId}/book`,
    sessionData
  );
  return data;
};

export const getMyTrainerSessions = () => api.get("/api/trainers/my-sessions");

// Training Request Functions
export const submitTrainingRequest = async (requestData: {
  traineeId: string;
  ptId: string;
  serviceName: string;
  message?: string;
}) => {
  const { data } = await api.post("/api/trainers/submit-request", requestData);
  return data;
};

// Progress & Stats Functions
export const getProgress = () => api.get("/api/progress/stats");

export const updateProgress = async (progressData: {
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  steps?: number;
  calories?: number;
  workoutDuration?: number;
  date?: string;
}) => {
  const { data } = await api.put("/api/progress", progressData);
  return data;
};

export const getProgressHistory = (timeRange: string = "30d") =>
  api.get(`/api/progress/history?range=${timeRange}`);

// Fitness Plan Functions
export const getFitnessPlans = () => api.get("/api/fitness-plans");

export const getMyFitnessPlan = () => api.get("/api/fitness-plans/my");

export const enrollInPlan = async (planId: string) => {
  const { data } = await api.post(`/api/fitness-plans/${planId}/enroll`);
  return data;
};

// Equipment Functions
export const getEquipment = () => api.get("/api/equipment");

export const getEquipmentAvailability = (equipmentId: string) =>
  api.get(`/api/equipment/${equipmentId}/availability`);

export const reserveEquipment = async (
  equipmentId: string,
  reservationData: {
    date: string;
    startTime: string;
    duration: number;
  }
) => {
  const { data } = await api.post(
    `/api/equipment/${equipmentId}/reserve`,
    reservationData
  );
  return data;
};

// Nutrition Functions
export const getNutritionPlan = () => api.get("/api/nutrition/plan");

export const logMeal = async (mealData: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date?: string;
}) => {
  const { data } = await api.post("/api/nutrition/meals", mealData);
  return data;
};

export const getDailyNutrition = (date?: string) =>
  api.get(`/api/nutrition/daily${date ? `?date=${date}` : ""}`);

// Social Functions
export const getLeaderboard = (category: string = "steps") =>
  api.get(`/api/social/leaderboard?category=${category}`);

export const getFriends = () => api.get("/api/social/friends");

export const addFriend = async (username: string) => {
  const { data } = await api.post("/api/social/friends", { username });
  return data;
};

export const challengeFriend = async (
  friendId: string,
  challengeData: {
    type: string;
    target: number;
    duration: number;
    description: string;
  }
) => {
  const { data } = await api.post(`/api/social/challenges`, {
    friendId,
    ...challengeData,
  });
  return data;
};
