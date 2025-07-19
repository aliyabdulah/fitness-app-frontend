import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import the Trainer interface from home.ts to ensure consistency
import { Trainer } from '../api/home';

interface SuggestedPTProps {
  trainers?: Trainer[];
}

export function SuggestedPT({ trainers }: SuggestedPTProps) {
  const router = useRouter();

  const handleTrainerPress = (trainer: Trainer) => {
    router.push({
      pathname: '/(protected)/trainer-profile',
      params: { id: trainer._id }
    });
  };

  const handleSeeAllPress = () => {
    router.push('/(protected)/explore');
  };

  // Don't render anything if no trainers from backend
  if (!trainers || trainers.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Suggested Trainers</Text>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={{ color: colors.primary, fontSize: 12 }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 4 }}>
        {trainers.map((trainer) => {
          // Handle the new User model structure with proper fallbacks
          const trainerName = trainer.name || `${trainer.firstName} ${trainer.lastName}`;
          const trainerImage = trainer.profilePicture || trainer.image || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';
          const trainerServices = trainer.services || [];
          const trainerRating = trainer.stats?.rating || 4.5;
          
          return (
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
                  source={{ uri: trainerImage }} 
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
                  {trainerName}
                </Text>
                
                {/* Service Name - Smaller, lighter grey text */}
                <Text style={{ 
                  color: colors.gray400, 
                  fontSize: 12,
                  textAlign: 'center'
                }}>
                  {trainerServices[0]?.name || 'Personal Trainer'}
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
                    {trainerRating}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
} 