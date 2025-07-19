import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useRef, useState } from "react";
import { register } from "../../api/auth";
import AuthContext from "../../context/AuthContext";
import {
    Alert,
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Colors = {
  primary: "#FF4C29",
  background: "#082032",
  card: "#2C394B",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  error: "#EF4444",
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

interface FitnessGoal {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const fitnessGoals: FitnessGoal[] = [
  {
    id: "lose_weight",
    title: "Lose Weight",
    subtitle: "Burn fat & get lean",
    icon: "🔥",
    color: "#FF6B6B",
  },
  {
    id: "build_muscle",
    title: "Build Muscle",
    subtitle: "Gain strength & size",
    icon: "💪",
    color: "#4ECDC4",
  },
  {
    id: "stay_fit",
    title: "Stay Fit",
    subtitle: "Maintain health",
    icon: "🎯",
    color: "#45B7D1",
  },
  {
    id: "endurance",
    title: "Endurance",
    subtitle: "Boost stamina",
    icon: "🏃",
    color: "#96CEB4",
  },
  {
    id: "flexibility",
    title: "Flexibility",
    subtitle: "Improve mobility",
    icon: "🧘",
    color: "#FECA57",
  },
];

const fitnessLevels = [
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "New to fitness",
    icon: "🌱",
    color: "#4ECDC4",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "Some experience",
    icon: "💪",
    color: "#45B7D1",
  },
  {
    id: "advanced",
    title: "Advanced",
    subtitle: "Very experienced",
    icon: "🏆",
    color: "#FF6B6B",
  },
];

export default function SignupSurveyScreen() {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const params = useLocalSearchParams();
  
  // Update the params to include profilePicture
  const signupData = {
    firstName: params.firstName as string,
    lastName: params.lastName as string,
    email: params.email as string,
    password: params.password as string,
    profilePicture: params.profilePicture as string, // Add this line
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    age: 25,
    weight: 70,
    height: 170,
    fitnessLevel: "",
    fitnessGoal: "",
    workoutFrequency: 3,
  });

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Scale animations for interaction feedback
  const ageScaleAnim = useRef(new Animated.Value(1)).current;
  const weightScaleAnim = useRef(new Animated.Value(1)).current;
  const heightScaleAnim = useRef(new Animated.Value(1)).current;
  const frequencyScaleAnim = useRef(new Animated.Value(1)).current;

  // Age pan responder with smooth momentum
  const agePanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(ageScaleAnim, {
        toValue: 1.05,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (evt, gestureState) => {
      const sensitivity = 0.02;
      const ageChange = gestureState.dx * sensitivity;
      const newAge = Math.max(16, Math.min(75, surveyData.age + ageChange));

      if (Math.abs(newAge - surveyData.age) >= 1) {
        setSurveyData((prev) => ({ ...prev, age: Math.round(newAge) }));
        Haptics.selectionAsync();
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      Animated.spring(ageScaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();

      // Add smooth momentum
      const velocity = gestureState.vx;
      const momentum = velocity * 0.05;
      const finalAge = Math.max(
        16,
        Math.min(75, Math.round(surveyData.age + momentum))
      );

      setSurveyData((prev) => ({ ...prev, age: finalAge }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  // Weight pan responder with smooth momentum
  const weightPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(weightScaleAnim, {
        toValue: 1.05,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (evt, gestureState) => {
      const sensitivity = 0.03;
      const weightChange = gestureState.dx * sensitivity;
      const newWeight = Math.max(40, Math.min(200, surveyData.weight + weightChange));

      if (Math.abs(newWeight - surveyData.weight) >= 1) {
        setSurveyData((prev) => ({ ...prev, weight: Math.round(newWeight) }));
        Haptics.selectionAsync();
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      Animated.spring(weightScaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();

      const velocity = gestureState.vx;
      const momentum = velocity * 0.1;
      const finalWeight = Math.max(
        40,
        Math.min(200, Math.round(surveyData.weight + momentum))
      );

      setSurveyData((prev) => ({ ...prev, weight: finalWeight }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  // Height pan responder
  const heightPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(heightScaleAnim, {
        toValue: 1.05,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (evt, gestureState) => {
      const sensitivity = 0.02;
      const heightChange = gestureState.dx * sensitivity; // Horizontal swipe
      const newHeight = Math.max(140, Math.min(220, surveyData.height + heightChange));

      if (Math.abs(newHeight - surveyData.height) >= 1) {
        setSurveyData((prev) => ({ ...prev, height: Math.round(newHeight) }));
        Haptics.selectionAsync();
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      Animated.spring(heightScaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();

      const velocity = gestureState.vx;
      const momentum = velocity * 0.05;
      const finalHeight = Math.max(
        140,
        Math.min(220, Math.round(surveyData.height + momentum))
      );

      setSurveyData((prev) => ({ ...prev, height: finalHeight }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  // Workout frequency pan responder
  const frequencyPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(frequencyScaleAnim, {
        toValue: 1.05,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (evt, gestureState) => {
      const sensitivity = 0.01;
      const frequencyChange = gestureState.dx * sensitivity;
      const newFrequency = Math.max(1, Math.min(7, surveyData.workoutFrequency + frequencyChange));

      if (Math.abs(newFrequency - surveyData.workoutFrequency) >= 1) {
        setSurveyData((prev) => ({ ...prev, workoutFrequency: Math.round(newFrequency) }));
        Haptics.selectionAsync();
      }
    },
    onPanResponderRelease: () => {
      Animated.spring(frequencyScaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  useEffect(() => {
    // Animate in when component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentStep]);

  const getAgeCategory = (age: number) => {
    if (age < 25) return { name: "Young Adult", emoji: "🧒", color: "#4ECDC4" };
    if (age < 35) return { name: "Adult", emoji: "👤", color: "#45B7D1" };
    if (age < 50) return { name: "Mature", emoji: "🧑", color: "#96CEB4" };
    return { name: "Senior", emoji: "👴", color: "#FECA57" };
  };

  const getFrequencyText = (frequency: number) => {
    const texts = {
      1: "Light Activity",
      2: "Casual Exercise",
      3: "Regular Training",
      4: "Dedicated Athlete",
      5: "Serious Trainer",
      6: "Elite Level",
      7: "Professional"
    };
    return texts[frequency as keyof typeof texts] || "Regular Training";
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      // Reset animations for next step
      slideAnim.setValue(0);
      scaleAnim.setValue(0.8);
      
      setCurrentStep(currentStep + 1);
      
      // Animate in the new step
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Complete registration
      try {
        const result = await register({
          ...signupData,
          ...surveyData,
          image: signupData.profilePicture, // Add this line to pass the image
        });

        // Auto-login after successful registration
        if (result.token && result.user) {
          // Set authentication state
          setIsAuthenticated(true);
          
          // Show success message and redirect to home
          Alert.alert(
            'Welcome to TrainX!',
            'Your account has been created successfully.',
            [
              {
                text: 'Get Started',
                onPress: () => router.replace("/(protected)/home")
              }
            ]
          );
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Please try again';
        Alert.alert('Registration Failed', errorMessage);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      // Reset animations for previous step
      slideAnim.setValue(0);
      scaleAnim.setValue(0.8);
      
      setCurrentStep(currentStep - 1);
      
      // Animate in the previous step
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const renderAgeSelector = () => {
    const ageCategory = getAgeCategory(surveyData.age);
    
    return (
      <Animated.View
        style={[
          styles.stepContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: scaleAnim },
            ],
            opacity: slideAnim,
          },
        ]}
      >
        <Text style={styles.stepTitle}>How old are you?</Text>
        <Text style={styles.stepSubtitle}>Swipe left or right to adjust</Text>

        <View style={styles.ageContainer}>
          <View
            style={[
              styles.ageCategoryCard,
              { backgroundColor: ageCategory.color },
            ]}
          >
            <Text style={styles.ageCategoryEmoji}>{ageCategory.emoji}</Text>
            <Text style={styles.ageCategoryName}>{ageCategory.name}</Text>
          </View>

          <View style={styles.ageDisplay}>
            <Text style={styles.ageNumber}>{surveyData.age}</Text>
            <Text style={styles.ageLabel}>years old</Text>
          </View>

          <View style={styles.swipeInstructions}>
            <Text style={styles.swipeText}>👈 Swipe to adjust 👉</Text>
          </View>

          <Animated.View
            style={[
              styles.ageSwipeArea,
              {
                transform: [{ scale: ageScaleAnim }],
              },
            ]}
            {...agePanResponder.panHandlers}
          >
            <View style={styles.ageScale}>
              <View style={styles.agePointer} />
              <View style={styles.ageMarks}>
                {Array.from({ length: 15 }, (_, i) => {
                  const age = 16 + i * 4;
                  const isActive = Math.abs(age - surveyData.age) <= 2;
                  const distance = Math.abs(age - surveyData.age);
                  const opacity = Math.max(0.3, 1 - distance / 10);

                  return (
                    <View key={i} style={styles.ageMark}>
                      <View
                        style={[
                          styles.ageLine,
                          {
                            backgroundColor: isActive
                              ? Colors.primary
                              : Colors.textSecondary,
                            height: isActive ? 40 : 25,
                            opacity: opacity,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.ageMarkText,
                          {
                            color: isActive
                              ? Colors.primary
                              : Colors.textSecondary,
                            opacity: opacity,
                            fontWeight: isActive ? "bold" : "normal",
                          },
                        ]}
                      >
                        {age}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const renderWeightSelector = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <Text style={styles.stepTitle}>What's your weight?</Text>
      <Text style={styles.stepSubtitle}>Swipe left or right to adjust</Text>

      <View style={styles.weightContainer}>
        <View style={styles.weightDisplay}>
          <Text style={styles.weightNumber}>{surveyData.weight}</Text>
          <Text style={styles.weightUnit}>kg</Text>
        </View>

        <View style={styles.swipeInstructions}>
          <Text style={styles.swipeText}>👈 Swipe to adjust 👉</Text>
        </View>

        <Animated.View
          style={[
            styles.weightSwipeArea,
            {
              transform: [{ scale: weightScaleAnim }],
            },
          ]}
          {...weightPanResponder.panHandlers}
        >
          <View style={styles.weightScale}>
            <View style={styles.weightPointer} />
            <View style={styles.weightMarks}>
              {Array.from({ length: 17 }, (_, i) => {
                const weight = 40 + i * 10;
                const isActive = Math.abs(weight - surveyData.weight) <= 5;
                const distance = Math.abs(weight - surveyData.weight);
                const opacity = Math.max(0.3, 1 - distance / 20);

                return (
                  <View key={i} style={styles.weightMark}>
                    <View
                      style={[
                        styles.weightLine,
                        {
                          backgroundColor: isActive
                            ? Colors.primary
                            : Colors.textSecondary,
                          height: isActive ? 35 : 25,
                          opacity: opacity,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.weightMarkText,
                        {
                          color: isActive
                            ? Colors.primary
                            : Colors.textSecondary,
                          opacity: opacity,
                          fontWeight: isActive ? "bold" : "normal",
                        },
                      ]}
                    >
                      {weight}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderHeightSelector = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <Text style={styles.stepTitle}>How tall are you?</Text>
      <Text style={styles.stepSubtitle}>Swipe left or right to adjust</Text>

      <View style={styles.heightContainer}>
        <View style={styles.heightDisplay}>
          <Text style={styles.heightNumber}>{surveyData.height}</Text>
          <Text style={styles.heightUnit}>cm</Text>
        </View>

        <View style={styles.swipeInstructions}>
          <Text style={styles.swipeText}>👈 Swipe to adjust 👉</Text>
        </View>

        <Animated.View
          style={[
            styles.heightSwipeArea,
            {
              transform: [{ scale: heightScaleAnim }],
            },
          ]}
          {...heightPanResponder.panHandlers}
        >
          <View style={styles.heightScale}>
            <View style={styles.heightPointer} />
            <View style={styles.heightMarks}>
              {Array.from({ length: 17 }, (_, i) => {
                const height = 140 + i * 5;
                const isActive = Math.abs(height - surveyData.height) <= 2;
                const distance = Math.abs(height - surveyData.height);
                const opacity = Math.max(0.3, 1 - distance / 15);

                return (
                  <View key={i} style={styles.heightMark}>
                    <View
                      style={[
                        styles.heightLine,
                        {
                          backgroundColor: isActive
                            ? Colors.primary
                            : Colors.textSecondary,
                          height: isActive ? 35 : 25,
                          opacity: opacity,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.heightMarkText,
                        {
                          color: isActive
                            ? Colors.primary
                            : Colors.textSecondary,
                          opacity: opacity,
                          fontWeight: isActive ? "bold" : "normal",
                        },
                      ]}
                    >
                      {height}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderFitnessLevelSelector = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <Text style={styles.stepTitle}>What's your fitness level?</Text>
      <Text style={styles.stepSubtitle}>Choose your experience level</Text>

      <View style={styles.goalsContainer}>
        {fitnessLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.goalCard,
              surveyData.fitnessLevel === level.id && styles.goalCardActive,
              {
                backgroundColor:
                  surveyData.fitnessLevel === level.id
                    ? level.color
                    : Colors.card,
              },
            ]}
            onPress={() => {
              setSurveyData({ ...surveyData, fitnessLevel: level.id });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={styles.goalIcon}>{level.icon}</Text>
            <Text
              style={[
                styles.goalTitle,
                surveyData.fitnessLevel === level.id && styles.goalTitleActive,
              ]}
            >
              {level.title}
            </Text>
            <Text
              style={[
                styles.goalSubtitle,
                surveyData.fitnessLevel === level.id &&
                  styles.goalSubtitleActive,
              ]}
            >
              {level.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderGoalSelector = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <Text style={styles.stepTitle}>What's your main goal?</Text>
      <Text style={styles.stepSubtitle}>We'll create a plan that fits your objective</Text>

      <View style={styles.goalsContainer}>
        {fitnessGoals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              surveyData.fitnessGoal === goal.id && styles.goalCardActive,
              {
                backgroundColor:
                  surveyData.fitnessGoal === goal.id
                    ? goal.color
                    : Colors.card,
              },
            ]}
            onPress={() => {
              setSurveyData({ ...surveyData, fitnessGoal: goal.id });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={styles.goalIcon}>{goal.icon}</Text>
            <Text
              style={[
                styles.goalTitle,
                surveyData.fitnessGoal === goal.id && styles.goalTitleActive,
              ]}
            >
              {goal.title}
            </Text>
            <Text
              style={[
                styles.goalSubtitle,
                surveyData.fitnessGoal === goal.id && styles.goalSubtitleActive,
              ]}
            >
              {goal.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderWorkoutFrequencySelector = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <Text style={styles.stepTitle}>How often do you work out?</Text>
      <Text style={styles.stepSubtitle}>Swipe to adjust frequency</Text>

      <View style={styles.frequencyContainer}>
        <View style={styles.frequencyDisplay}>
          <Text style={styles.frequencyNumber}>{surveyData.workoutFrequency}</Text>
          <Text style={styles.frequencyLabel}>days per week</Text>
        </View>

        <View style={styles.frequencyDescription}>
          <Text style={styles.frequencyDescText}>
            {getFrequencyText(surveyData.workoutFrequency)}
          </Text>
        </View>

        <View style={styles.swipeInstructions}>
          <Text style={styles.swipeText}>👈 Swipe to adjust 👉</Text>
        </View>

        <Animated.View
          style={[
            styles.frequencySwipeArea,
            {
              transform: [{ scale: frequencyScaleAnim }],
            },
          ]}
          {...frequencyPanResponder.panHandlers}
        >
          <View style={styles.frequencyScale}>
            {Array.from({ length: 7 }, (_, i) => {
              const day = i + 1;
              const isActive = day === surveyData.workoutFrequency;
              const distance = Math.abs(day - surveyData.workoutFrequency);
              const opacity = Math.max(0.3, 1 - distance / 3);

              return (
                <View key={i} style={styles.frequencyMark}>
                  <View
                    style={[
                      styles.frequencyDot,
                      {
                        backgroundColor: isActive
                          ? Colors.primary
                          : Colors.textSecondary,
                        opacity: opacity,
                        transform: [{ scale: isActive ? 1.3 : 1 }],
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.frequencyMarkText,
                      {
                        color: isActive ? Colors.primary : Colors.textSecondary,
                        opacity: opacity,
                        fontWeight: isActive ? "bold" : "normal",
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 0: return true; // Age selector
      case 1: return true; // Weight selector
      case 2: return true; // Height selector
      case 3: return surveyData.fitnessLevel !== "";
      case 4: return surveyData.fitnessGoal !== "";
      case 5: return true; // Frequency selector
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderAgeSelector();
      case 1: return renderWeightSelector();
      case 2: return renderHeightSelector();
      case 3: return renderFitnessLevelSelector();
      case 4: return renderGoalSelector();
      case 5: return renderWorkoutFrequencySelector();
      default: return renderAgeSelector();
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Personal Info",
      "Body Stats",
      "Physical Data",
      "Experience",
      "Goals",
      "Schedule"
    ];
    return titles[currentStep] || "Setup";
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          {Array.from({ length: 6 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= currentStep && styles.progressActive,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.stepInfo}>
          <Text style={styles.stepNumber}>{currentStep + 1}/6</Text>
          <Text style={styles.stepLabel}>{getStepTitle()}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isCurrentStepComplete() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isCurrentStepComplete()}
        >
          <Text style={[
            styles.nextButtonText,
            !isCurrentStepComplete() && styles.nextButtonTextDisabled,
          ]}>
            {currentStep === 5 ? "Complete Setup" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  progressContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    flex: 1,
    justifyContent: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  progressActive: {
    backgroundColor: Colors.primary,
  },
  stepInfo: {
    alignItems: "flex-end",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    minHeight: screenHeight * 0.7,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["4xl"],
  },

  // Age Selector Styles
  ageContainer: {
    alignItems: "center",
    width: "100%",
  },
  ageCategoryCard: {
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  ageCategoryEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  ageCategoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  ageDisplay: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  ageNumber: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.primary,
  },
  ageLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  swipeInstructions: {
    marginBottom: Spacing["3xl"],
  },
  swipeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  ageSwipeArea: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  ageScale: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  agePointer: {
    position: "absolute",
    top: 20,
    width: 2,
    height: 25,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  ageMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingTop: 25,
  },
  ageMark: {
    alignItems: "center",
  },
  ageLine: {
    width: 2,
    marginBottom: Spacing.sm,
  },
  ageMarkText: {
    fontSize: 10,
  },

  // Weight Selector Styles
  weightContainer: {
    alignItems: "center",
    width: "100%",
  },
  weightDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing["3xl"],
  },
  weightNumber: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.primary,
  },
  weightUnit: {
    fontSize: 24,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  weightSwipeArea: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  weightScale: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  weightPointer: {
    position: "absolute",
    top: 20,
    width: 2,
    height: 25,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  weightMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingTop: 25,
  },
  weightMark: {
    alignItems: "center",
  },
  weightLine: {
    width: 2,
    marginBottom: Spacing.sm,
  },
  weightMarkText: {
    fontSize: 10,
  },

  // Height Selector Styles
  heightContainer: {
    alignItems: "center",
    width: "100%",
  },
  heightDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing["3xl"],
  },
  heightNumber: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.primary,
  },
  heightUnit: {
    fontSize: 24,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  heightSwipeArea: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  heightScale: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heightPointer: {
    position: "absolute",
    top: 20,
    width: 2,
    height: 25,
    backgroundColor: Colors.primary,
    zIndex: 1,
  },
  heightMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingTop: 25,
  },
  heightMark: {
    alignItems: "center",
  },
  heightMarkText: {
    fontSize: 10,
  },
  heightLine: {
    width: 2,
    marginBottom: Spacing.sm,
  },

  // Fitness Level & Goals Styles
  goalsContainer: {
    width: "100%",
    gap: Spacing.lg,
  },
  goalCard: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalCardActive: {
    borderColor: Colors.textPrimary,
    transform: [{ scale: 1.02 }],
  },
  goalIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  goalTitleActive: {
    color: Colors.textPrimary,
  },
  goalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    opacity: 0.8,
  },
  goalSubtitleActive: {
    color: Colors.textPrimary,
    opacity: 1,
  },

  // Workout Frequency Styles
  frequencyContainer: {
    alignItems: "center",
    width: "100%",
  },
  frequencyDisplay: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  frequencyNumber: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.primary,
  },
  frequencyLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  frequencyDescription: {
    marginBottom: Spacing["3xl"],
  },
  frequencyDescText: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  frequencySwipeArea: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  frequencyScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  frequencyMark: {
    alignItems: "center",
  },
  frequencyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  frequencyMarkText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Bottom Section
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["4xl"],
    paddingTop: Spacing.lg,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  nextButtonTextDisabled: {
    color: Colors.background,
  },
}); 