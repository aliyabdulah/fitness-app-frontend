import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Colors, Typography } from './theme';

interface TrainXLogoProps extends ViewProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function TrainXLogo({ 
  size = 'medium', 
  showText = true, 
  style,
  ...props 
}: TrainXLogoProps) {
  const logoSize = {
    small: 32,
    medium: 48,
    large: 64,
  }[size];

  const textSize = {
    small: 16,
    medium: 20,
    large: 24,
  }[size];

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={[styles.logoCircle, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
        <Text style={[styles.logoSymbol, { fontSize: logoSize * 0.5 }]}>T</Text>
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize: textSize }]}>TrainX</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoSymbol: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  logoText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
}); 