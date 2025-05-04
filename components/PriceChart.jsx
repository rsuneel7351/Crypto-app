import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const PriceChart = ({
  data,
  isLoading,
  timeRange,
  onTimeRangeChange,
  color = '#6E56CF',
}) => {
  const timeRanges = ['1d', '7d', '30d', '90d', '1y', 'max'];
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 260;

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    value: 0,
    visible: false,
  });

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  if (!data || !data.prices || data.prices.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>No chart data available</Text>
      </View>
    );
  }

  const chartPrices = data.prices.map(([timestamp, price]) => Number(price));
  const timestamps = data.prices.map(([timestamp]) => timestamp);

  const formatLabel = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '1d') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeRange === '7d') return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const chartData = {
    labels: [
      formatLabel(timestamps[0]),
      formatLabel(timestamps[Math.floor(timestamps.length / 2)]),
      formatLabel(timestamps[timestamps.length - 1]),
    ],
    datasets: [
      {
        data: chartPrices,
        color: () => color,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: () => color,
    labelColor: () => '#666',
    propsForDots: {
      r: '3',
      strokeWidth: '0',
    },
    propsForBackgroundLines: {
      stroke: '#e2e8f0',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeRangeRow}>
        {timeRanges.map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              timeRange === range && styles.activeRangeButton,
            ]}
            onPress={() => onTimeRangeChange(range)}
          >
            <Text style={[
              styles.rangeText,
              timeRange === range && styles.activeRangeText,
            ]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={chartHeight}
          chartConfig={chartConfig}
          withInnerLines={true}
          withOuterLines={false}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          bezier
          onDataPointClick={(data) => {
            const isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;
            setTooltipPos((prev) => ({
              x: data.x,
              y: data.y,
              value: data.value,
              visible: !isSamePoint || !prev.visible,
            }));
          }}
          decorator={() =>
            tooltipPos.visible ? (
              <View
                style={{
                  position: 'absolute',
                  left: tooltipPos.x - 40,
                  top: tooltipPos.y + 10,
                  backgroundColor: '#6E56CF',
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 12 }}>
                  ${tooltipPos.value.toFixed(2)}
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.labelText}>{formatLabel(timestamps[0])}</Text>
        <Text style={styles.labelText}>{formatLabel(timestamps[timestamps.length - 1])}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    paddingTop: 12,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: 40,
  },
  timeRangeRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
    gap: 8,
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeRangeButton: {
    backgroundColor: '#6E56CF',
  },
  rangeText: {
    color: '#333',
    fontSize: 14,
  },
  activeRangeText: {
    color: '#fff',
    fontWeight: '600',
  },
  chartWrapper: {
    height: 260,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    color: '#555',
    fontSize: 12,
  },
});

export default PriceChart;
