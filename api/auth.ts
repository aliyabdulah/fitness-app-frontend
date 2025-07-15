import axios from "axios";
import { setToken, removeToken } from "./storage";
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

export const register = async (userInfo: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel: string;
  fitnessGoal: string;
  workoutFrequency: number;
  image?: string | null;
}) => {
  const formData = new FormData();

  // Basic signup data
  formData.append("firstName", userInfo.firstName);
  formData.append("lastName", userInfo.lastName);
  formData.append("email", userInfo.email);
  formData.append("password", userInfo.password);

  // Survey data
  formData.append("age", userInfo.age.toString());
  formData.append("weight", userInfo.weight.toString());
  formData.append("height", userInfo.height.toString());
  formData.append("fitnessLevel", userInfo.fitnessLevel);
  formData.append("fitnessGoal", userInfo.fitnessGoal);
  formData.append("workoutFrequency", userInfo.workoutFrequency.toString());

  // Profile image if provided
  if (userInfo.image) {
    formData.append("image", {
      name: "profile.jpg",
      uri: userInfo.image,
      type: "image/jpeg",
    } as any);
  }

  const { data } = await api.post("/api/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data.token) {
    await setToken(data.token);
  }

  return data;
};

export const login = async (userInfo: { email: string; password: string }) => {
  const { data } = await api.post("/api/auth/login", userInfo);

  if (data.token) {
    await setToken(data.token);
  }

  return data;
};

export const logout = async () => {
  await removeToken();
  return { success: true };
};
