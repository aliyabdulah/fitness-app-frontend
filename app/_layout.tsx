// app/_layout.tsx

import { getToken } from "../api/storage";
import AuthContext from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../component/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  
  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setReady(true);
  };
  
  useEffect(() => {
    checkToken();
  }, []);
  
  if (!ready) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.background 
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor={Colors.background}
      />
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background }
          }}>
            {isAuthenticated ? (
              <Stack.Screen name="(protected)" />
            ) : (
              <>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
              </>
            )}
          </Stack>
        </AuthContext.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
} 