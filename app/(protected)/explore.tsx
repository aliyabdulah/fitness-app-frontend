import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
} from "react-native";
import { colors } from "../../component/theme";
import { TrainXTrainerCard } from "../../component/TrainXTrainerCard";
import { TrainXFilterBar } from "../../component/TrainXFilterBar";
import SearchBar from "../../component/SearchBar";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllTrainers } from "../../api/Data";

const USER_AVATAR =
  "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg";

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    getAllTrainers()
      .then((res) => {
        // Handle the new User model structure
        const trainerUsers = res.data.trainers || [];
        setTrainers(trainerUsers);
      })
      .catch((error) => {
        console.error("Error fetching trainers:", error);
        setTrainers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      // Handle the new User model structure
      const trainerName = trainer.name || `${trainer.firstName} ${trainer.lastName}`;
      const trainerServices = trainer.services || [];
      const trainerImage = trainer.profilePicture || trainer.image;
      
      const matchesFilter =
        activeFilter === "All" ||
        trainerServices.some(
          (s: any) =>
            s.name === activeFilter || trainer.category === activeFilter
        );
      const matchesSearch =
        trainerName.toLowerCase().includes(search.toLowerCase()) ||
        trainerServices.some((s: any) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search, trainers]);

  const renderTrainerItem = ({ item: trainer }: { item: any }) => {
    // Handle the new User model structure
    const trainerName = trainer.name || `${trainer.firstName} ${trainer.lastName}`;
    const trainerImage = trainer.profilePicture || trainer.image;
    const trainerServices = trainer.services || [];
    
    return (
      <View style={{ paddingHorizontal: 24 }}>
        <TrainXTrainerCard
          image={trainerImage}
          name={trainerName}
          rate={trainerServices[0]?.price || ""}
          specialties={trainerServices.map((s: any) => s.name)}
          onPress={() =>
            router.push({
              pathname: "/(protected)/trainer-profile",
              params: { id: trainer._id },
            })
          }
        />
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <View>
          <Text
            style={{ color: colors.white, fontSize: 26, fontWeight: "bold" }}
          >
            Personal Trainers
          </Text>
          <Text style={{ color: colors.gray400, fontSize: 13, marginTop: 4 }}>
            Find your perfect match
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Image
            source={{ uri: USER_AVATAR }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      </View>
      
      {/* Filters with integrated search */}
      <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Search Icon - LEFT side */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              borderRadius: 999,
              width: 36, // Fixed width to maintain circle
              height: 36, // Fixed height to maintain circle
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -8, // Adjust to match the filter bar's visual center
            }}
            onPress={() => setSearchExpanded(!searchExpanded)}
          >
            <FontAwesome5 
              name={searchExpanded ? "times" : "search"} 
              size={14} 
              color={colors.white} 
            />
          </TouchableOpacity>
          
          {/* Filter Bar - takes remaining space */}
          <View style={{ flex: 1 }}>
            <TrainXFilterBar
              activeFilter={activeFilter}
              onChangeFilter={setActiveFilter}
            />
          </View>
        </View>
      </View>
      
      {/* Collapsible Search Input - pushes content down */}
      <View
        style={{
          paddingHorizontal: 24,
          height: searchExpanded ? 60 : 0,
          overflow: 'hidden',
          marginBottom: searchExpanded ? 8 : 0,
        }}
      >
        {searchExpanded && (
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search trainers by name or specialization..."
            onSubmitEditing={() => {}}
            returnKeyType="search"
            autoFocus={true}
          />
        )}
      </View>
    </>
  );

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <FlatList
        data={filteredTrainers}
        renderItem={renderTrainerItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
