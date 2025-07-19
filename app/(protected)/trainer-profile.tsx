import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "../../component/theme";
import { ServiceCard } from "../../component/ServiceCard";
import { StatCard } from "../../component/StatCard";
import { getTrainerById, submitTrainingRequest } from "../../api/Data";
import { FontAwesome5 } from "@expo/vector-icons";
import { getUserData } from "../../api/storage";

export default function TrainerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user data
    getUserData().then(setCurrentUser);
    
    if (id) {
      getTrainerById(id as string)
        .then((res) => {
          // Handle the new User model structure
          const trainerData = res.data.trainer;
          if (trainerData) {
            // Transform the data to match expected structure
            const transformedTrainer = {
              ...trainerData,
              name: trainerData.name || `${trainerData.firstName} ${trainerData.lastName}`,
              image: trainerData.profilePicture || trainerData.image,
              services: trainerData.services || [],
              stats: trainerData.stats || {
                clientsCoached: '0',
                yearsExperience: 0,
                rating: 4.5,
                certifications: 0
              },
              bio: trainerData.bio || 'Personal Trainer'
            };
            setTrainer(transformedTrainer);
          }
        })
        .catch((error) => {
          console.error('Error fetching trainer:', error);
          setTrainer(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleApplyForTraining = async () => {
    if (!currentUser || !trainer || selectedService === null) {
      Alert.alert("Error", "Please select a service and ensure you're logged in.");
      return;
    }

    // Debug logging
    console.log('Current User:', currentUser);
    console.log('Current User ID:', currentUser._id);
    console.log('Trainer:', trainer);
    console.log('Selected Service:', selectedService);

    setSubmitting(true);
    try {
      const selectedServiceData = trainer.services[selectedService];
      
      const requestData = {
        traineeId: currentUser._id || currentUser.id, // Try both _id and id
        ptId: trainer._id,
        serviceName: selectedServiceData.name,
        message: `I'm interested in your ${selectedServiceData.name} service.`
      };
      
      console.log('Request Data being sent:', requestData);
      
      const response = await submitTrainingRequest(requestData);
      console.log('Response:', response);

      Alert.alert(
        "Application Submitted Successfully!",
        `Your training application for ${selectedServiceData.name} has been sent to ${trainer.name}. You'll receive a response within 24-48 hours.`
      );
      
      // Reset selection
      setSelectedService(null);
    } catch (error: any) {
      console.error('Error submitting training request:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert(
        "Error",
        `Failed to submit your application: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.secondary,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  
  if (!trainer) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.secondary,
        }}
      >
        <Text style={{ color: colors.white }}>Trainer not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <FontAwesome5 name="arrow-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trainer Profile</Text>
          {/* <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {}}
            accessibilityLabel="Share profile"
          >
            <FontAwesome5 name="share" size={20} color={colors.white} />
          </TouchableOpacity> */}
          {/* empty view to push the title to the left */}
          <View style={{width:50}}/> 
        </View>
        {/* Main Info */}
        <View style={styles.mainInfoCard}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: trainer.image }} style={styles.avatar} />
            </View>
            <Text style={styles.trainerName}>{trainer.name}</Text>
            <TouchableOpacity
              style={styles.igBtn}
              onPress={() =>
                trainer.instagram ? router.push(trainer.instagram) : null
              }
              accessibilityLabel="Instagram profile"
              disabled={!trainer.instagram}
            >
              <FontAwesome5 name="instagram" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Services & Pricing */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Services & Pricing</Text>
          {trainer.services && trainer.services.length > 0 ? (
            trainer.services.map((service: any, idx: number) => (
              <ServiceCard
                key={service.name}
                name={service.name}
                description={service.description}
                price={service.price}
                isPopular={service.isPopular}
                selected={selectedService === idx}
                onPress={() => setSelectedService(idx)}
              />
            ))
          ) : (
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>No services available at the moment.</Text>
            </View>
          )}
        </View>
        {/* About */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>
            About {trainer.name.split(" ")[0]}
          </Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{trainer.bio}</Text>
          </View>
        </View>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            value={trainer.stats.clientsCoached}
            label="Clients Coached"
          />
          <StatCard
            value={trainer.stats.yearsExperience}
            label="Years Experience"
          />
          <StatCard value={trainer.stats.rating} label="Rating" />
          <StatCard
            value={trainer.stats.certifications}
            label="Certifications"
          />
        </View>
      </ScrollView>
      {/* Apply for Training Button */}
      <View style={styles.bookNowWrapper}>
        <TouchableOpacity
          style={[
            styles.bookNowBtn,
            { opacity: selectedService === null || submitting ? 0.5 : 1 },
          ]}
          disabled={selectedService === null || submitting}
          onPress={handleApplyForTraining}
          accessibilityLabel="Apply for Training"
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <FontAwesome5
              name="calendar-plus"
              size={18}
              color={colors.white}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.bookNowText}>
            {submitting ? "Submitting..." : "Apply for Training"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  iconBtn: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    padding: 12,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "600",
  },
  mainInfoCard: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trainerName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  igBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    padding: 10,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  bioCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
  },
  bioText: {
    color: colors.gray400,
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  bookNowWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondary,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
  bookNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: "center",
  },
  bookNowText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
