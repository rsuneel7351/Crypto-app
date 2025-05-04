import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Header from "./Header";
import { useFavorites } from "../hooks/useFavorites";
import { fetchFavoriteCryptocurrencies } from "../apis/crypto";
import CryptoCard from "./CryptoCard";
// import { useToast } from "@/hooks/use-toast";

const Favourite = ({ navigation }) => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [favoritesCrypto, setFavoritesCrypto] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast();

  // Function to fetch favorite cryptocurrencies (mock API call or service)
  const loadFavoriteCryptocurrencies = async () => {
    if (favorites.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Mock data fetch (replace with actual API call)
      const favoriteCryptos = await fetchFavoriteCryptocurrencies(favorites);
      setFavoritesCrypto(favoriteCryptos);
    } catch (error) {
      // toast({
      //   title: "Failed to load favorites",
      //   description: "Please check your internet connection and try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  // Call on initial render and whenever the favorites list changes
  useEffect(() => {
    loadFavoriteCryptocurrencies();

    const intervalId = setInterval(() => {
      loadFavoriteCryptocurrencies();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(intervalId);
  }, [favorites]);

  // Handle the click on a cryptocurrency card
  const handleCryptoClick = (id) => {
    navigation.navigate("Details", { itemId: id });
  };

  // Toggle favorite and update the list
  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    // If we're removing from favorites, update the list immediately
    if (isFavorite(id)) {
      setFavoritesCrypto((prevCryptos) =>
        prevCryptos.filter((crypto) => crypto.id !== id)
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} /> */}
      <Text style={styles.title}>My Favorites</Text>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          {/* {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonLoader key={index} className="h-32" />
          ))} */}
        </View>
      ) : favoritesCrypto.length > 0 ? (
        <FlatList
          data={favoritesCrypto}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CryptoCard
              crypto={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={handleToggleFavorite}
              onPress={() =>
                navigation.navigate('CryptoDetail', { id: item.id })
              }
            />
          )}
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>You haven't added any cryptocurrencies to favorites yet.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Browse cryptocurrencies</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  loaderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  list: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f4511e",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Favourite;
