import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("cryptoFavorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("cryptoFavorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    };

    saveFavorites();
  }, [favorites]);

  const addFavorite = (cryptoId) => {
    setFavorites((prev) => {
      if (!prev.includes(cryptoId)) {
        return [...prev, cryptoId];
      }
      return prev;
    });
  };

  const removeFavorite = (cryptoId) => {
    setFavorites((prev) => prev.filter((id) => id !== cryptoId));
  };

  const isFavorite = (cryptoId) => favorites.includes(cryptoId);

  const toggleFavorite = (cryptoId) => {
    if (isFavorite(cryptoId)) {
      removeFavorite(cryptoId);
    } else {
      addFavorite(cryptoId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
