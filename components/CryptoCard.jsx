

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const CryptoCard = ({ crypto, isFavorite, onToggleFavorite, onPress }) => {
  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? 'green' : 'red';
  const sparklineData = crypto?.sparkline_in_7d?.price || [];

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(crypto)}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconAndTitle}>
          <Image source={{ uri: crypto.image }} style={styles.icon} />
          <View>
            <Text style={styles.name}>{crypto.name}</Text>
            <Text style={styles.symbol}>{crypto.symbol.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onToggleFavorite(crypto.id)}>
          <FontAwesome
            name={isFavorite ? 'star' : 'star-o'}
            size={20}
            color={isFavorite ? '#facc15' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>${crypto.current_price.toLocaleString()}</Text>
          <Text style={[styles.change, { color: priceChangeColor }]}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>

        {sparklineData?.length > 0 && (
          <LineChart
            data={{
              datasets: [{ data: sparklineData }],
            }}
            width={120}
            height={50}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: () => priceChangeColor,
              strokeWidth: 2,
            }}
            style={styles.chart}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light gray border
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 16,
  },
  name: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 14,
  },
  symbol: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  price: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  change: {
    fontSize: 14,
    marginTop: 4,
  },
  chart: {
    paddingRight: 0,
    marginLeft: 10,
  },
});

export default CryptoCard;
