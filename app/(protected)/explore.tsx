import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
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

  useEffect(() => {
    getAllTrainers()
      .then((res) => setTrainers(res.data.trainers))
      .finally(() => setLoading(false));
  }, []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesFilter =
        activeFilter === "All" ||
        trainer.services.some(
          (s: any) =>
            s.name === activeFilter || trainer.category === activeFilter
        );
      const matchesSearch =
        trainer.name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.services.some((s: any) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search, trainers]);

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
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
            <TouchableOpacity
              style={{
                backgroundColor: colors.accent,
                borderRadius: 999,
                padding: 12,
                marginRight: 8,
              }}
            >
              <FontAwesome5 name="search" size={18} color={colors.white} />
            </TouchableOpacity>
            <Image
              source={{ uri: USER_AVATAR }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
        </View>
        {/* Filters */}
        <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
          <TrainXFilterBar
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
          />
        </View>
        {/* Search Bar */}
        <View style={{ paddingHorizontal: 24 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search trainers by name or specialization..."
          />
        </View>
        {/* Top Trainers Section */}
        <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 24,
            }}
          >
            Top 3 Personal Trainers
          </Text>
          {filteredTrainers.slice(0, 3).map((trainer) => (
            <TrainXTrainerCard
              key={trainer._id}
              image={trainer.image}
              name={trainer.name}
              rate={trainer.services[0]?.price || ""}
              specialties={trainer.services.map((s: any) => s.name)}
              onPress={() =>
                router.push({
                  pathname: "/(protected)/trainer-profile",
                  params: { id: trainer._id },
                })
              }
            />
          ))}
        </View>
        {/* Scroll for More Section */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}>
          <Text
            style={{ color: colors.gray400, fontSize: 12, marginBottom: 6 }}
          >
            Scroll down for more trainers
          </Text>
          <FontAwesome5
            name="chevron-down"
            size={20}
            color={colors.primary}
            style={{ marginBottom: 4 }}
          />
        </View>
        {/* More Trainers Section */}
        <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 24,
            }}
          >
            More Trainers
          </Text>
          {filteredTrainers.slice(3).map((trainer) => (
            <TrainXTrainerCard
              key={trainer._id}
              image={trainer.image}
              name={trainer.name}
              rate={trainer.services[0]?.price || ""}
              specialties={trainer.services.map((s: any) => s.name)}
              onPress={() =>
                router.push({
                  pathname: "/(protected)/trainer-profile",
                  params: { id: trainer._id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
