import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from './theme';

interface ProgressGraphProps {
  data: { x: string; y: number }[];
  color: string;
  label?: string;
  height?: number;
}

export function ProgressGraph({ data, color, label, height = 180 }: ProgressGraphProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 80;
  const chartHeight = height - 40;
  
  if (data.length === 0) return null;
  
  // Calculate min and max values for scaling
  const yValues = data.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;
  
  // Create path for the line
  const createPath = () => {
    const stepX = chartWidth / (data.length - 1);
    
    return data.map((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point.y - minY) / yRange) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  // Create area path (for gradient fill)
  const createAreaPath = () => {
    const stepX = chartWidth / (data.length - 1);
    
    const linePath = data.map((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point.y - minY) / yRange) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        
        {/* Area fill */}
        <Path
          d={createAreaPath()}
          fill="url(#gradient)"
        />
        
        {/* Line */}
        <Path
          d={createPath()}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const stepX = chartWidth / (data.length - 1);
          const x = index * stepX;
          const y = chartHeight - ((point.y - minY) / yRange) * chartHeight;
          
          return (
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={color}
              stroke={colors.secondary}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary + '33',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  svg: {
    overflow: 'visible',
  },
}); 