import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from './theme';

interface TrainXLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function TrainXLogo({ size = 'medium' }: TrainXLogoProps) {
  const sizes = {
    small: { width: 40, height: 40, fontSize: 14 },
    medium: { width: 100, height: 100, fontSize: 20 },
    large: { width: 120, height: 120, fontSize: 24 },
  };

  const currentSize = sizes[size];

  return (
    <View style={[
      styles.logoCircle,
      {
        width: currentSize.width,
        height: currentSize.height,
        borderRadius: currentSize.width / 2,
      }
    ]}>
      <Text style={[styles.logoText, { fontSize: currentSize.fontSize }]}>
        TrainX
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoCircle: {
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
}); 