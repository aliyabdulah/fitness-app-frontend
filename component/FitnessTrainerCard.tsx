import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './theme';
import Card from './Card';

interface FitnessTrainerCardProps extends TouchableOpacityProps {
  name: string;
  specialty: string;
  rating: string;
  image: string;
}

export default function FitnessTrainerCard({
  name,
  specialty,
  rating,
  image,
  onPress,
  ...props
}: FitnessTrainerCardProps) {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <Card style={styles.container}>
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>{image}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingIcon}>⭐</Text>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 140,
    marginRight: Spacing.lg,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  imageText: {
    fontSize: 32,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  specialty: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 12,
    marginRight: Spacing.xs,
  },
  ratingText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
}); 