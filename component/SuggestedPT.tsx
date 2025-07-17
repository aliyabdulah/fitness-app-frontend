import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Trainer {
  _id: string;
  name: string;
  image: string;
  bio: string;
  services?: Array<{
    name: string;
    description: string;
    price: string;
    isPopular?: boolean;
  }>;
  stats: {
    rating: number;
  };
}

interface SuggestedPTProps {
  trainers?: Trainer[];
}

export function SuggestedPT({ trainers }: SuggestedPTProps) {
  const router = useRouter();

  // Default trainers (original hardcoded data)
  const defaultTrainers = [
    {
      _id: '1',
      name: 'John Doe',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9ce58e7f5c-97783cf9a63d140bc055.png',
      bio: 'Weight Training',
      services: [{ name: 'One on One Training', description: 'Personalized training sessions', price: '60 KWD / session' }],
      stats: { rating: 4.9 }
    },
    {
      _id: '2',
      name: 'Sarah Kim',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d2434f5789-e511a40292f55cb83903.png',
      bio: 'HIIT Expert',
      services: [{ name: 'HIIT Training', description: 'High-intensity interval training', price: '50 KWD / session' }],
      stats: { rating: 4.8 }
    },
    {
      _id: '3',
      name: 'Mike Ross',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c8755d8682-e1529869c52d4a190a1a.png',
      bio: 'Yoga & Pilates',
      services: [{ name: 'Yoga & Pilates', description: 'Mind-body fitness training', price: '45 KWD / session' }],
      stats: { rating: 4.7 }
    },
  ];

  // Use backend data or fallback to original data
  const currentTrainers = trainers && trainers.length > 0 ? trainers : defaultTrainers;

  const handleTrainerPress = (trainer: Trainer) => {
    router.push({
      pathname: '/(protected)/trainer-profile',
      params: { trainerId: trainer._id }
    });
  };

  const handleSeeAllPress = () => {
    router.push('/(protected)/explore');
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Suggested Trainers</Text>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={{ color: colors.primary, fontSize: 12 }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 4 }}>
        {currentTrainers.map((trainer) => (
          <TouchableOpacity 
            key={trainer._id} 
            style={{ 
              width: 140, 
              backgroundColor: colors.accent, 
              borderRadius: 14, 
              overflow: 'hidden' 
            }} 
            onPress={() => handleTrainerPress(trainer)}
          >
            {/* Top Section - Image Area (takes up most of the card) */}
            <View style={{ height: 120, overflow: 'hidden' }}>
              <Image 
                source={{ uri: trainer.image }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="cover" 
              />
            </View>
            
            {/* Bottom Section - Text Information Area (solid background) */}
            <View style={{ 
              padding: 12, 
              backgroundColor: colors.secondary,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Trainer Name - Large, bold, white text */}
              <Text style={{ 
                color: colors.white, 
                fontSize: 16, 
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 2
              }}>
                {trainer.name}
              </Text>
              
              {/* Service Name - Smaller, lighter grey text */}
              <Text style={{ 
                color: colors.gray400, 
                fontSize: 12,
                textAlign: 'center'
              }}>
                {trainer.services?.[0]?.name || 'Personal Trainer'}
              </Text>
              
              {/* Rating - Small star icon with rating */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginTop: 4,
                justifyContent: 'center'
              }}>
                <FontAwesome5 name="star" size={10} color={colors.yellow} />
                <Text style={{ 
                  color: colors.white, 
                  fontSize: 11, 
                  marginLeft: 3 
                }}>
                  {trainer.stats.rating}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 