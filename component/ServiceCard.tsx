import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityProps,
} from "react-native";
import { colors } from "./theme";

interface ServiceCardProps extends AccessibilityProps {
  name: string;
  description: string;
  price: string;
  isPopular?: boolean;
  selected?: boolean;
  onPress: () => void;
}

export function ServiceCard({
  name,
  description,
  price,
  isPopular,
  selected,
  onPress,
  ...accessibilityProps
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
        { borderColor: selected ? colors.primary : "transparent" },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${name} service card`}
      {...accessibilityProps}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  popularText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    color: colors.gray400,
    fontSize: 13,
    marginBottom: 8,
  },
  price: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
