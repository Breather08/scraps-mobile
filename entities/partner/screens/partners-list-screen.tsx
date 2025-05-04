import { useEffect, useState, useRef } from "react";
import { fetchPartners } from "../api";
import { Partner } from "../types";
import PartnerCard from "../components/partner-card";
import PartnerSkeleton from "../components/partner-skeleton";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import Button from "@/components/ui/button";

export default function PartnersListScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State variables
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For featured partners section
  const [featuredPartners, setFeaturedPartners] = useState<Partner[]>([]);
  
  // Animation values
  const searchInputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    makePartnersRequest();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      filterPartners(activeFilter);
      const featured = [...partners]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setFeaturedPartners(featured);
    }
  }, [partners, activeFilter]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      filterPartners(activeFilter);
    } else {
      const filtered = partners.filter(partner =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPartners(filtered);
    }
  }, [searchQuery, partners, activeFilter]);

  async function makePartnersRequest() {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const response = await fetchPartners();
      setPartners(response);
      setFilteredPartners(response);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
      setInitialLoad(false);
    }
  }

  function getFilteredPartners(filter: string) {
    let filtered = [...partners];

    switch (filter) {
      case "nearby":
        return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "new":
        return [...partners].slice(0, 3);
      case "price":
        return filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  }
    

  function filterPartners(filter: string) {
    setActiveFilter(filter);
    const filtered = getFilteredPartners(filter);
    setFilteredPartners(filtered);
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Sarqyt</Text>
        </View>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color="#888" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Найти заведение..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                searchInputRef.current?.blur();
              }}
            >  
              <MaterialCommunityIcons name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  function renderFilterTabs() {
    return (
      <View style={styles.filterContainer}>
        <ScrollableFilterTabs 
          filters={[
            { id: 'nearby', label: 'Рядом', icon: 'map-marker' },
            { id: 'rating', label: 'Топ', icon: 'star-outline' },
            { id: 'price', label: 'Цена', icon: 'cash-multiple' },
            { id: 'new', label: 'Новые', icon: 'new-box' }
          ]}
          activeFilter={activeFilter}
          onSelectFilter={filterPartners}
        />
      </View>
    );
  }

  function renderSkeletonLoaders() {
    return Array(6).fill(0).map((_, index) => (
      <PartnerSkeleton key={`skeleton-${index}`} />
    ));
  }

  function renderEmptyState() {
    if (loading && !initialLoad) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#2ecc71" />
          </View>
          <Text style={styles.emptyStateText}>Загрузка партнеров...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialCommunityIcons name="wifi-off" size={40} color="#ff6b6b" />
          </View>
          <Text style={styles.emptyStateTitle}>Ошибка соединения</Text>
          <Text style={styles.emptyStateText}>
            Не удалось загрузить данные. Проверьте подключение к интернету.
          </Text>
          <Button 
            title="Повторить"
            onPress={makePartnersRequest}
            variant="primary"
            size="medium"
            leftIcon="refresh"
            style={styles.actionButton}
          />
        </View>
      );
    }
    
    if (filteredPartners.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="store-search" size={64} color="#e0e0e0" />
          </View>
          <Text style={styles.emptyStateTitle}>Ничего не найдено</Text>
          <Text style={styles.emptyStateText}>
            Попробуйте изменить параметры поиска или обновите список.
          </Text>
          <Button 
            title="Сбросить фильтры" 
            onPress={() => {
              setSearchQuery('');
              setActiveFilter('');
              makePartnersRequest();
            }}
            variant="primary"
            size="medium"
            leftIcon="filter-remove-outline"
            style={styles.actionButton}
          />
        </View>
      );
    }
    
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="white" />
      {renderHeader()}
      {renderFilterTabs()}
      
      {loading && initialLoad ? (
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderSkeletonLoaders()}
        </ScrollView>
      ) : (
        <Animated.FlatList
          contentContainerStyle={styles.container}
          data={filteredPartners}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => router.push(`/partners/${item.id}`)}
            >
              <PartnerCard partner={item} key={index} />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={makePartnersRequest}
              colors={["#2ecc71"]}
              tintColor="#2ecc71"
            />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true}
          )}
          scrollEventThrottle={16}
          initialNumToRender={8}
          removeClippedSubviews={true}
          maxToRenderPerBatch={4}
          windowSize={10}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

interface FilterTabProps {
  filters: Array<{id: string, label: string, icon: string}>;
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
}

function ScrollableFilterTabs({ filters, activeFilter, onSelectFilter }: FilterTabProps) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={filters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === item.id && styles.filterTabActive]}
          onPress={() => activeFilter === item.id ? onSelectFilter('') : onSelectFilter(item.id)}
          activeOpacity={0.7}
        >
          <Text 
            style={[styles.filterText, activeFilter === item.id && styles.filterTextActive]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.filterTabsContainer}
    />
  );
}

const styles = StyleSheet.create({
  staticHeader: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: -1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 1,
  },
  headerBackgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 200,
  },
  locationText: {
    color: '#333',
    fontSize: 14,
    marginHorizontal: 4,
    fontWeight: '500',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: { 
    padding: 12, 
    gap: 4,
  },
  headerOld: {
    backgroundColor: '#fff',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#2ecc71",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignSelf: 'center',
    height: 46,
    width: '94%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearButton: {
    padding: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTabsContainer: {
    paddingHorizontal: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  filterTabActive: {
    backgroundColor: '#2ecc71',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  featuredSection: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  featuredScrollContent: {
    paddingVertical: 8,
    paddingLeft: 4,
    paddingRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '500',
  },
  featuredCard: {
    width: 180,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  featuredLogoContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  featuredName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  featuredRatingText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  loadingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,200,200,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(240,240,240,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
