import React from "react";
import { View, Text, StyleSheet, AccessibilityProps } from "react-native";
import { colors } from "./theme";

interface StatCardProps extends AccessibilityProps {
  value: string | number;
  label: string;
}

export function StatCard({
  value,
  label,
  ...accessibilityProps
}: StatCardProps) {
  return (
    <View
      style={styles.card}
      accessibilityRole="summary"
      accessibilityLabel={`${label}: ${value}`}
      {...accessibilityProps}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
    flex: 1,
    minWidth: 120,
  },
  value: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    color: colors.gray400,
    fontSize: 13,
    textAlign: "center",
  },
});
