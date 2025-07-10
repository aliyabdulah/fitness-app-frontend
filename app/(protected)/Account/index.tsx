import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AuthContext from '../../../context/AuthContext';
import { removeToken, clearAllData } from '../../../api/storage';
import { 
  Colors, 
  Spacing, 
  Typography, 
  SectionHeader, 
  Card,
  Button,
  FitnessStatCard 
} from '../../../component';

export default function Profile() {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);

  const userStats = [
    {
      icon: '🎯',
      title: 'Goals Achieved',
      value: '12',
      target: 'this month',
      progress: 80,
    },
    {
      icon: '🔥',
      title: 'Streak',
      value: '7',
      target: 'days',
      progress: 70,
    },
  ];

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              setIsAuthenticated(false);
              router.replace("/" as any);
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'App settings will be available soon!');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy details will be shown here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support: support@trainx.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionHeader title="Profile" />
          
          {/* User Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>Ahmed Al-Khalil</Text>
                <Text style={styles.userEmail}>ahmed@trainx.com</Text>
                <Text style={styles.memberSince}>Member since Jan 2024</Text>
              </View>
            </View>
            <Button
              title="Edit Profile"
              variant="secondary"
              onPress={handleEditProfile}
              style={styles.editButton}
            />
          </Card>

          {/* User Stats */}
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <FitnessStatCard
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  target={stat.target}
                  progress={stat.progress}
                />
              </View>
            ))}
          </View>

          {/* Fitness Goals */}
          <Text style={styles.sectionTitle}>Fitness Goals</Text>
          <Card style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <Text style={styles.goalEmoji}>🏋️</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Weight Training</Text>
                <Text style={styles.goalDescription}>3 sessions per week</Text>
              </View>
              <Text style={styles.goalStatus}>✅</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalEmoji}>🏃</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Cardio</Text>
                <Text style={styles.goalDescription}>20 minutes daily</Text>
              </View>
              <Text style={styles.goalStatus}>⏳</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalEmoji}>⚖️</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Weight Goal</Text>
                <Text style={styles.goalDescription}>Lose 5kg by June</Text>
              </View>
              <Text style={styles.goalStatus}>📈</Text>
            </View>
          </Card>

          {/* App Settings */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.settingsCard}>
            <Button
              title="⚙️ App Settings"
              variant="ghost"
              onPress={handleSettings}
              style={styles.settingButton}
            />
            <Button
              title="🔔 Notifications"
              variant="ghost"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
              style={styles.settingButton}
            />
            <Button
              title="🔒 Privacy Policy"
              variant="ghost"
              onPress={handlePrivacy}
              style={styles.settingButton}
            />
            <Button
              title="❓ Help & Support"
              variant="ghost"
              onPress={handleSupport}
              style={styles.settingButton}
            />
          </Card>

          {/* Logout Button */}
          <Button
            title="Logout"
            variant="secondary"
            onPress={handleLogout}
            style={styles.logoutButton}
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
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
  },
  goalsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '20',
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: Spacing.lg,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  goalDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  goalStatus: {
    fontSize: 20,
  },
  settingsCard: {
    marginBottom: Spacing.xl,
  },
  settingButton: {
    justifyContent: 'flex-start',
    marginBottom: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
}); 