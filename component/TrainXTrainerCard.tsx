import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from './theme';

interface TrainXTrainerCardProps {
  image: string;
  name: string;
  rate: string;
  specialties: string[];
  onPress: () => void;
}

export function TrainXTrainerCard({ image, name, rate, specialties, onPress }: TrainXTrainerCardProps) {
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 16, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 100, height: 100, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, flexShrink: 0 }}>
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{name}</Text>
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500', marginBottom: 8 }}>{rate}</Text>
          <View style={{ flexDirection: 'column', gap: 6 }}>
            {specialties.map((spec, index) => (
              <View key={index} style={{ backgroundColor: colors.secondary + '88', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 4 }}>
                <Text style={{ color: colors.white, fontSize: 12, textAlign: 'center', overflow: 'hidden' }}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, marginTop: 16 }}>
        <Text style={{ color: colors.white, fontSize: 15, fontWeight: '500', textAlign: 'center' }}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
} 