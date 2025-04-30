import { useEffect, useState, useRef } from "react";
import { fetchPartners } from "../api";
import { Partner } from "../types";
import PartnerCard from "../components/partner-card";
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
  Easing,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

export default function PartnersListScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State variables
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For featured partners section
  const [featuredPartners, setFeaturedPartners] = useState<Partner[]>([]);
  
  // Animation values
  const searchInputRef = useRef<TextInput>(null);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 70, 90],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp'
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -120],
    extrapolate: 'clamp'
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -68],
    extrapolate: 'clamp'
  });
  
  useEffect(() => {
    makePartnersRequest();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      filterPartners(activeFilter);
      // Set featured partners (could be top rated, closest, etc.)
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
    }
  }

  function filterPartners(filter: string) {
    setActiveFilter(filter);
    let filtered = [...partners];

    switch (filter) {
      case "nearby":
        filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        // Simulate 'new' partners by taking first few
        filtered = [...partners].slice(0, 3);
        break;
      case "price":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredPartners(filtered);
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color="#888" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Найти партнеров..."
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
            { id: 'all', label: 'Все', icon: 'view-grid-outline' as any },
            { id: 'nearby', label: 'Рядом', icon: 'map-marker' as any },
            { id: 'rating', label: 'Топ', icon: 'star-outline' as any },
            { id: 'price', label: 'Цена', icon: 'cash-multiple' as any },
            { id: 'new', label: 'Новые', icon: 'new-box' as any }
          ]}
          activeFilter={activeFilter}
          onSelectFilter={filterPartners}
        />
      </View>
    );
  }

  function renderFeaturedPartners() {
    if (!featuredPartners.length) return null;
    
    return (
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="star" size={18} color="#2ecc71" style={{marginRight: 6}} />
            <Text style={styles.sectionTitle}>Рекомендуемые</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButtonContainer}>
            <Text style={styles.seeAllButton}>Все</Text>
            <MaterialCommunityIcons name="chevron-right" size={14} color="#2ecc71" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScrollContent}
        >
          {featuredPartners.map(partner => (
            <FeaturedPartnerCard key={`featured-${partner.id}`} partner={partner} />
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderEmptyState() {
    if (loading) {
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
          <TouchableOpacity style={styles.retryButton} onPress={makePartnersRequest}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setSearchQuery('');
              setActiveFilter('all');
              makePartnersRequest();
            }}
          >
            <Text style={styles.retryButtonText}>Сбросить фильтры</Text>
          </TouchableOpacity>
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
      
      <Animated.FlatList
        contentContainerStyle={styles.container}
        data={filteredPartners}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderFeaturedPartners}
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
          onPress={() => onSelectFilter(item.id)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name={item.icon as any} 
            size={18} 
            color={activeFilter === item.id ? '#fff' : '#555'} 
            style={{marginRight: 5}}
          />
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

function FeaturedPartnerCard({ partner }: { partner: Partner }) {
  return (
    <TouchableOpacity style={styles.featuredCard}>
      <Image 
        source={{ uri: partner.backgroundUrl || 'https://via.placeholder.com/150' }} 
        style={styles.featuredImage} 
      />
      <View style={styles.featuredOverlay}>
        <View style={styles.featuredLogoContainer}>
          <Image 
            source={{ uri: partner.logoUrl || 'https://via.placeholder.com/50' }} 
            style={styles.featuredLogo} 
          />
        </View>
        <Text style={styles.featuredName}>{partner.name}</Text>
        <View style={styles.featuredRating}>
          <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
          <Text style={styles.featuredRatingText}>{partner.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
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
    gap: 10,
    paddingTop: 0,
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
    height: 40,
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
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    paddingVertical: 8,
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
});
