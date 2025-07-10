import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, BorderRadius } from './theme';

interface BackButtonProps extends TouchableOpacityProps {
  onPress: () => void;
}

export default function BackButton({ onPress, style, ...props }: BackButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      {...props}
    >
      <Text style={styles.text}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
}); 