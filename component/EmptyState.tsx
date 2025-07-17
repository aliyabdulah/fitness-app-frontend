import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from './theme';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  iconSize?: number;
  iconColor?: string;
  showExploreButton?: boolean;
  onExplorePress?: () => void;
}

export function EmptyState({ 
  icon = "inbox", 
  title = "No data available", 
  message = "Check back later or contact support",
  iconSize = 48,
  iconColor = colors.gray400,
  showExploreButton = false,
  onExplorePress
}: EmptyStateProps) {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary,
      padding: 20,
    }}>
      <FontAwesome5 
        name={icon} 
        size={iconSize} 
        color={iconColor} 
      />
      <Text style={{
        color: colors.white,
        fontSize: 16,
        marginTop: 16,
        textAlign: "center",
        fontWeight: "600",
      }}>
        {title}
      </Text>
      <Text style={{
        color: colors.gray400,
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: showExploreButton ? 24 : 0,
      }}>
        {message}
      </Text>
      
      {showExploreButton && onExplorePress && (
        <TouchableOpacity
          onPress={onExplorePress}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="search" size={16} color={colors.white} />
          <Text style={{
            color: colors.white,
            fontSize: 14,
            fontWeight: '600',
          }}>
            Find Personal Trainers
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 