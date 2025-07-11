import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../../component/theme';
import { TrainXTrainerCard } from '../../component/TrainXTrainerCard';
import { TrainXFilterBar } from '../../component/TrainXFilterBar';
import SearchBar from '../../component/SearchBar';
import { TrainXBottomNavBar } from '../../component/TrainXBottomNavBar';
import { FontAwesome5 } from '@expo/vector-icons';

const TRAINERS = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    rate: '$60/hr',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/934951a78a-f3ac923bf346857d9e5a.png',
    specialties: ['One on One', 'Supervision', 'Health Plan'],
    category: 'Weight Training',
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    rate: '$55/hr',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/abffc59216-2c2d8f8e26c1108e2364.png',
    specialties: ['One on One', 'Supervision', 'Health Plan'],
    category: 'HIIT',
  },
  {
    id: '3',
    name: 'Omar Hassan',
    rate: '$50/hr',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/01549d9832-06a5003b5305f603c2fa.png',
    specialties: ['One on One', 'Health Plan'],
    category: 'Weight Training',
  },
  {
    id: '4',
    name: 'Yusuf Al-Ahmad',
    rate: '$35/hr',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/aef9ffe45b-9b25027a1512b6fda159.png',
    specialties: ['One on One', 'Health Plan'],
    category: 'Cardio',
  },
];

const USER_AVATAR = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTrainers = useMemo(() => {
    return TRAINERS.filter((trainer) => {
      const matchesFilter = activeFilter === 'All' || trainer.category === activeFilter;
      const matchesSearch =
        trainer.name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Status Bar (custom) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 12 }}>
          <Text style={{ color: colors.white, fontSize: 14 }}>9:41</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <FontAwesome5 name="signal" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <FontAwesome5 name="wifi" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <FontAwesome5 name="battery-full" size={16} color={colors.white} />
          </View>
        </View>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 }}>
          <View>
            <Text style={{ color: colors.white, fontSize: 26, fontWeight: 'bold' }}>Personal Trainers</Text>
            <Text style={{ color: colors.gray400, fontSize: 13, marginTop: 4 }}>Find your perfect match</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity style={{ backgroundColor: colors.accent, borderRadius: 999, padding: 12, marginRight: 8 }}>
              <FontAwesome5 name="search" size={18} color={colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: USER_AVATAR }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
        </View>
        {/* Filters */}
        <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
          <TrainXFilterBar activeFilter={activeFilter} onChangeFilter={setActiveFilter} />
        </View>
        {/* Search Bar */}
        <View style={{ paddingHorizontal: 24 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search trainers by name or specialization..." />
        </View>
        {/* Top Trainers Section */}
        <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', marginBottom: 24 }}>Top 3 Personal Trainers</Text>
          {filteredTrainers.slice(0, 3).map((trainer) => (
            <TrainXTrainerCard
              key={trainer.id}
              image={trainer.image}
              name={trainer.name}
              rate={trainer.rate}
              specialties={trainer.specialties}
              onPress={() => {}}
            />
          ))}
        </View>
        {/* Scroll for More Section */}
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text style={{ color: colors.gray400, fontSize: 12, marginBottom: 6 }}>Scroll down for more trainers</Text>
          <FontAwesome5 name="chevron-down" size={20} color={colors.primary} style={{ marginBottom: 4 }} />
        </View>
        {/* More Trainers Section */}
        <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', marginBottom: 24 }}>More Trainers</Text>
          {filteredTrainers.slice(3).map((trainer) => (
            <TrainXTrainerCard
              key={trainer.id}
              image={trainer.image}
              name={trainer.name}
              rate={trainer.rate}
              specialties={trainer.specialties}
              onPress={() => {}}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <TrainXBottomNavBar activeTab="Explore" />
      </View>
    </SafeAreaView>
  );
} 