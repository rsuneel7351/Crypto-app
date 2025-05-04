import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CryptoCard from './CryptoCard';
import { useFavorites } from '../hooks/useFavorites';
import { fetchCryptocurrencies } from '../apis/crypto';
import Header from './Header';

const ITEMS_PER_PAGE = 20;

const HomeScreen = ({ navigation }) => {
  const [cryptos, setCryptos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadCryptos();
  }, [page]);

  const loadCryptos = async () => {
    setLoading(true);
    try {
      const data = await fetchCryptocurrencies(page, ITEMS_PER_PAGE);
      setCryptos(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const filtered = cryptos.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} /> */}

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#0ea5e9" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CryptoCard
                crypto={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={() =>
                  navigation.navigate('CryptoDetail', { id: item.id })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Fixed pagination at bottom */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </TouchableOpacity>

        {[...Array(5)].map((_, index) => {
          const pageNumber = Math.max(1, page - 2) + index;
          return (
            <TouchableOpacity
              key={pageNumber}
              onPress={() => setPage(pageNumber)}
              style={[
                styles.pageNumber,
                pageNumber === page && styles.currentPage,
              ]}
            >
              <Text
                style={[
                  styles.pageNumberText,
                  pageNumber === page && styles.currentPageText,
                ]}
              >
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => setPage(prev => prev + 1)}
          style={styles.pageButton}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    color: '#111827',
    marginBottom: 16,
  },

  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  pageButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },

  pageButtonDisabled: {
    backgroundColor: '#94a3b8',
  },

  pageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  pageNumber: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 2,
  },

  currentPage: {
    backgroundColor: '#0ea5e9',
  },

  pageNumberText: {
    fontSize: 14,
    color: '#1f2937',
  },

  currentPageText: {
    color: '#fff',
    fontWeight: '600',
  },


});
