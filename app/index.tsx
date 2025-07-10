import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Colors, 
  Spacing,
  BorderRadius,
  Typography,
  TrainXLogo, 
  Button, 
  FeatureCard 
} from "../component";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <TrainXLogo size="large" />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>Your Fitness Journey</Text>
          <Text style={styles.highlightText}>Starts Here</Text>

          <Text style={styles.subtitle}>
            Track workouts by equipment number.{"\n"}
            Connect with trainers.
          </Text>

          {/* Feature Cards */}
          <View style={styles.featuresContainer}>
            <FeatureCard
              icon="🏋️"
              title="Track Equipment"
              description="Find workouts by machine number"
            />
            <FeatureCard
              icon="👥"
              title="Personal Training"
              description="Connect with trainers in Kuwait"
            />
            <FeatureCard
              icon="📊"
              title="Progress Analytics"
              description="Track your fitness journey in details"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomSection}>
          <Button
            title="Sign Up"
            variant="primary"
            fullWidth
            onPress={() => router.push("/(auth)/register")}
          />
          <Button
            title="Login"
            variant="secondary"
            fullWidth
            onPress={() => router.push("/(auth)/login")}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["4xl"],
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Main Content
  mainContent: {
    alignItems: "center",
    marginBottom: Spacing["5xl"],
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 40,
  },
  highlightText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing["4xl"],
  },

  // Features Section
  featuresContainer: {
    width: "100%",
    gap: Spacing.lg,
  },
  featureCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  iconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom Section
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["4xl"],
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  loginButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
}); 