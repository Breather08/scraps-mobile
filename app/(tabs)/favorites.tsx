import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/providers/auth-provider';
import PartnerCard from '@/entities/partner/components/partner-card';
import { Partner } from '@/entities/partner/types';
import { fetchFavoritePartners } from '@/entities/partner/api';


export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFavoritePartners()
  }, [user?.id]);

  async function setFavoritePartners() {
    setIsLoading(true)
    const data = await fetchFavoritePartners()
    setFavorites(data)
    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {isLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>You haven't added any favorites yet.</Text>
          <Text style={styles.emptySubText}>
            Explore businesses and tap the heart icon to add them to your favorites.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <PartnerCard partner={{...item, isFavorite: true}} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  listContainer: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});
