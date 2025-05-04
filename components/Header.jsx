

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { searchCryptocurrencies } from "../apis/crypto";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTimeout = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchCryptocurrencies(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleResultPress = (crypto) => {
    setSearchQuery("");
    setShowResults(false);
    Keyboard.dismiss();
    navigation.navigate("CryptoDetail", { id: crypto.id });
  };

  const handleOutsideTap = () => {
    Keyboard.dismiss();
    setShowResults(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleOutsideTap}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        {/* Left: Logo / App Name */}
        <TouchableOpacity style={styles.left} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.logoText}>Crypto</Text>
        </TouchableOpacity>

        {/* Center: Search Input */}
        <View style={styles.center}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coins..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
            />
          </View>
        </View>

        {/* Right: Favorite Icon */}
        <TouchableOpacity style={styles.right} onPress={() => navigation.navigate("Favourite")}>
          <Ionicons name="star" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Dropdown search results */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <ActivityIndicator size="small" color="#2a71d0" />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleResultPress(item)}
                >
                  <Text style={styles.resultText}>{item.name}</Text>
                  <Text style={styles.resultSymbol}>{item.symbol.toUpperCase()}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultText}>No results found</Text>
              }
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 100,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 3,
    alignItems: "center",
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2a71d0",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    width: "100%",
    maxWidth: 250,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
    overflow: "hidden",
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
  },
  resultSymbol: {
    fontSize: 12,
    color: "#888",
  },
  noResultText: {
    padding: 12,
    textAlign: "center",
    color: "#888",
  },
});

export default Header;
