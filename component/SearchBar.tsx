import React from 'react';
import { View, TextInput } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View style={{ position: 'relative', marginBottom: 24 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search trainers by name or specialization...'}
        placeholderTextColor={colors.gray400}
        style={{
          width: '100%',
          backgroundColor: colors.accent,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 16,
          color: colors.white,
          fontSize: 15,
          borderWidth: 1,
          borderColor: colors.gray700,
        }}
      />
      <FontAwesome5
        name="search"
        size={18}
        color={colors.gray400}
        style={{ position: 'absolute', right: 20, top: '50%', marginTop: -9 }}
      />
    </View>
  );
} 