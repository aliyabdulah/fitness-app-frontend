import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

const trainers = [
  {
    name: 'John Doe',
    specialty: 'Weight Training',
    rating: 4.9,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9ce58e7f5c-97783cf9a63d140bc055.png',
  },
  {
    name: 'Sarah Kim',
    specialty: 'HIIT Expert',
    rating: 4.8,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d2434f5789-e511a40292f55cb83903.png',
  },
  {
    name: 'Mike Ross',
    specialty: 'Yoga & Pilates',
    rating: 4.7,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c8755d8682-e1529869c52d4a190a1a.png',
  },
];

export function SuggestedPT() {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Suggested Trainers</Text>
        <Text style={{ color: colors.primary, fontSize: 12 }}>See All</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 4 }}>
        {trainers.map((trainer) => (
          <View key={trainer.name} style={{ width: 140, backgroundColor: colors.accent, borderRadius: 14, overflow: 'hidden' }}>
            <View style={{ height: 110, overflow: 'hidden' }}>
              <Image source={{ uri: trainer.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={{ padding: 8 }}>
              <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>{trainer.name}</Text>
              <Text style={{ color: colors.gray400, fontSize: 12 }}>{trainer.specialty}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <FontAwesome5 name="star" size={12} color={colors.yellow} />
                <Text style={{ color: colors.white, fontSize: 12, marginLeft: 4 }}>{trainer.rating}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 