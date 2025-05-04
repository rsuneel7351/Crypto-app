// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import Header from "./Header";

// const Details = ({ route, navigation }) => {
//   // Extract parameters passed from the HomeScreen
//   console.log(route, 'route');
//   const { itemId } = route.params || {};
//   const id = route.params.id
//   console.log(id, 'id');
//   return (
//     <View style={styles.container}>
//       <Header navigation={navigation} />
//       <Text style={styles.title}>Details Screen</Text>

//       <View style={styles.infoCard}>
//         <Text style={styles.infoText}>Item ID: {itemId}</Text>
//         <Text style={styles.descriptionText}>
//           This is the detailed information about the selected item. You can display
//           various properties and information related to this specific item here.
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.buttonText}>Go Back</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.button, styles.secondaryButton]}
//         onPress={() => navigation.navigate("Favourite")}
//       >
//         <Text style={styles.buttonText}>View Favourites</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f9f9f9"
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   infoCard: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     width: "90%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 30,
//   },
//   infoText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   descriptionText: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   button: {
//     backgroundColor: "#f4511e",
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   secondaryButton: {
//     backgroundColor: "#2c3e50",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default Details;


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
// import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice, formatMarketCap, formatPercentage, formatSupply } from '../utils/formatters'
import Header from "./Header";
import { fetchCryptocurrencyDetails, fetchHistoricalData } from "../apis/crypto";
import PriceChart from "./PriceChart";


const CryptoDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [crypto, setCrypto] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  // const { isFavorite, toggleFavorite } = useFavorites();

  const loadCrypto = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptocurrencyDetails(id);
      setCrypto(data);
    } catch (err) {
      console.error("Failed to load crypto:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      setChartLoading(true);
      const data = await fetchHistoricalData(id, timeRange);
      setHistoricalData(data);
    } catch (err) {
      console.error("Failed to load chart:", err);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    loadCrypto();
  }, [id]);

  useEffect(() => {
    loadChartData();
  }, [id, timeRange]);

  if (loading || !crypto) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444";

  return (
    <ScrollView style={styles.container}>
      {/* <Header navigation={navigation} /> */}

      <View style={styles.headerRow}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={() => toggleFavorite(crypto.id)}>
          <Text style={styles.favoriteButton}>
            {isFavorite(crypto.id) ? "★ Remove" : "☆ Add"}
          </Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.cryptoHeader}>
        <Image source={{ uri: crypto.image }} style={styles.cryptoImage} />
        <View>
          <Text style={styles.cryptoTitle}>{crypto.name} ({crypto.symbol.toUpperCase()})</Text>
          <Text style={styles.rank}>Rank #{crypto.market_cap_rank}</Text>
        </View>
      </View>

      <View style={styles.priceInfo}>
        <Text style={styles.currentPrice}>{formatPrice(crypto.current_price)}</Text>
        <Text style={{ color: priceChangeColor }}>
          {formatPercentage(crypto.price_change_percentage_24h)} (24h)
        </Text>
      </View>

      <PriceChart
        data={historicalData}
        isLoading={chartLoading}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        color={priceChangeColor}
      />

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Market Cap</Text>
        <Text style={styles.cardValue}>{formatMarketCap(crypto.market_cap)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Circulating Supply</Text>
        <Text style={styles.cardValue}>{formatSupply(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Max Supply</Text>
        <Text style={styles.cardValue}>
          {crypto.max_supply ? formatSupply(crypto.max_supply) : "∞"} {crypto.symbol.toUpperCase()}
        </Text>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.cardTitle}>About {crypto.name}</Text>
        <Text style={styles.descriptionText}>
          {crypto.description || `${crypto.name} is a cryptocurrency with the symbol ${crypto.symbol.toUpperCase()}.`}
        </Text>

        {crypto.categories?.length > 0 && (
          <View style={styles.categories}>
            {crypto.categories.map((cat, idx) => (
              <Text key={idx} style={styles.category}>
                {cat}
              </Text>
            ))}
          </View>
        )}

        {crypto.links?.homepage?.[0] && (
          <TouchableOpacity onPress={() => Linking.openURL(crypto.links.homepage[0])}>
            <Text style={styles.link}>Visit Website</Text>
          </TouchableOpacity>
        )}
        {crypto.links?.twitter_screen_name && (
          <TouchableOpacity onPress={() => Linking.openURL(`https://twitter.com/${crypto.links.twitter_screen_name}`)}>
            <Text style={styles.link}>Twitter</Text>
          </TouchableOpacity>
        )}
        {crypto.links?.subreddit_url && (
          <TouchableOpacity onPress={() => Linking.openURL(crypto.links.subreddit_url)}>
            <Text style={styles.link}>Reddit</Text>
          </TouchableOpacity>
        )}
        {crypto.links?.repos_url?.github?.[0] && (
          <TouchableOpacity onPress={() => Linking.openURL(crypto.links.repos_url.github[0])}>
            <Text style={styles.link}>GitHub</Text>
          </TouchableOpacity>
        )}

        {crypto.last_updated && (
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(crypto.last_updated).toLocaleString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  backButton: { color: "#2c3e50", fontSize: 16 },
  favoriteButton: { color: "#f4c542", fontSize: 16 },
  cryptoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cryptoImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  cryptoTitle: { fontSize: 20, fontWeight: "bold" },
  rank: { color: "#888" },
  priceInfo: { marginBottom: 20 },
  currentPrice: { fontSize: 28, fontWeight: "bold" },
  infoCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardValue: { fontSize: 18, fontWeight: "bold" },
  descriptionCard: { marginTop: 20, padding: 16 },
  descriptionText: { fontSize: 15, marginBottom: 8, lineHeight: 22 },
  categories: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  category: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 4,
  },
  link: {
    color: "#1e90ff",
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
    paddingBottom: 12
  },
});

export default CryptoDetails;
