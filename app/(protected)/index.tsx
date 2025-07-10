import { Redirect } from 'expo-router';

export default function ProtectedIndex() {
  // Redirect to home tab as default
  return <Redirect href="/(protected)/home" />;
} 