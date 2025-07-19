import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "./theme";
import SearchBar from "./SearchBar";

interface MorphingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSearchToggle?: (expanded: boolean) => void;
}

export const MorphingSearchBar: React.FC<MorphingSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onSearchToggle,
}) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // Smooth expand/collapse animation
  useEffect(() => {
    const animations = [
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: searchExpanded ? 50 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: searchExpanded ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ];

    Animated.sequence(animations).start();
    
    // Notify parent component
    onSearchToggle?.(searchExpanded);
  }, [searchExpanded]);

  const handleToggle = () => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <View>
      {/* Search Icon Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.accent,
          borderRadius: 999,
          padding: 8,
          alignSelf: 'flex-start',
        }}
        onPress={handleToggle}
      >
        <FontAwesome5 
          name={searchExpanded ? "times" : "search"} 
          size={14} 
          color={colors.white} 
        />
      </TouchableOpacity>
      
      {/* Collapsible Search Input - positioned below the filter row */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 50, // Position below the filter row
          left: -24, // Extend to full width (accounting for parent padding)
          right: -24,
          height: animatedHeight,
          overflow: 'hidden',
          opacity: animatedOpacity,
          zIndex: 1000,
          paddingHorizontal: 24, // Add padding to match the layout
        }}
      >
        {searchExpanded && (
          <SearchBar
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        )}
      </Animated.View>
    </View>
  );
}; 