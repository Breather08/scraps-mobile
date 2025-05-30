import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import MapView, { Marker, Callout, UrlTile } from "react-native-maps";

import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { Partner } from "@/entities/partner/types";
import { fetchAllPartners } from "@/entities/partner/api";
import PartnerCard from "@/entities/partner/components/partner-card";

import ReanimatedCarousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

enum CategoryFilter {
  All = "all",
  Nearby = "nearby",
  Popular = "popular",
  New = "new",
  Discount = "discount",
}

interface MarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  partner: Partner;
}

export default function MapScreen() {
  const { user } = useAuth();
  const DEFAULT_COORDINATES = { latitude: 51.1694, longitude: 71.4491 };
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [, setErrorMsg] = useState<string>("");
  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(
    CategoryFilter.All
  );
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const handleLocationError = useCallback((error: string) => {
    setErrorMsg(error);
    setIsLoading(false);
    console.warn("Location error:", error);
  }, []);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        handleLocationError(
          "Доступ к местоположению запрещен. Используем примерное местоположение."
        );
        return;
      }

      const currentLocation = await getCurrentPositionAsync({
        accuracy: Platform.OS === "ios" ? 6 : 4,
      });

      setLocation(currentLocation);

      if (mapRef.current && mapReady) {
        const region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        };

        mapRef.current.animateToRegion(region, 800);
      }
    } catch (_) {
      handleLocationError("Не удалось определить местоположение");
    }
  }, [handleLocationError, mapReady, mapRef]);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const fetchPartnersData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllPartners();

      if (response && response.length > 0) {
        setPartners(response);
        setFilteredPartners(response);

        const markerData = response.map((partner) => ({
          id: partner.id,
          coordinate: partner.coords,
          partner: partner,
        }));

        setMarkers(markerData);
      }
    } catch (_error) {
      console.error("Error fetching partners:", _error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
    fetchPartnersData();
  }, [getLocation, fetchPartnersData]);

  const { width: screenWidth } = Dimensions.get("window");

  const handleFilterChange = useCallback(
    (filter: CategoryFilter) => {
      setActiveFilter(filter);

      let filtered = [...partners];
      switch (filter) {
        case CategoryFilter.Nearby:
          if (location?.coords) {
            filtered.sort((a, b) => {
              const distA =
                Math.pow(a.coords.latitude - location.coords.latitude, 2) +
                Math.pow(a.coords.longitude - location.coords.longitude, 2);
              const distB =
                Math.pow(b.coords.latitude - location.coords.latitude, 2) +
                Math.pow(b.coords.longitude - location.coords.longitude, 2);
              return distA - distB;
            });
          }
          break;
        case CategoryFilter.Popular:
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case CategoryFilter.New:
          filtered = filtered.slice(0, 3);
          break;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (partner) =>
            partner.name.toLowerCase().includes(query) ||
            partner.address.toLowerCase().includes(query)
        );
      }

      setFilteredPartners(filtered);
    },
    [partners, searchQuery, location]
  );

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      handleFilterChange(activeFilter);
    },
    [activeFilter, handleFilterChange]
  );

  const handleMarkerPress = useCallback(
    (markerId: string) => {
      setSelectedMarkerId(markerId);
      const selectedIndex = filteredPartners.findIndex(
        (p) => p.id === markerId
      );
      if (selectedIndex !== -1 && carouselRef.current) {
        carouselRef.current.scrollTo({ index: selectedIndex, animated: true });
      }
    },
    [filteredPartners]
  );

  const handleCarouselItemChange = useCallback(
    (index: number) => {
      if (index >= 0 && index < filteredPartners.length) {
        const partner = filteredPartners[index];
        setSelectedMarkerId(partner.id);

        mapRef.current?.animateToRegion(
          {
            latitude: partner.coords.latitude,
            longitude: partner.coords.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          },
          500
        );
      }
    },
    [filteredPartners]
  );

  const filterCategories = [
    { id: CategoryFilter.All, name: "Все", icon: "apps" },
    { id: CategoryFilter.Nearby, name: "Рядом", icon: "location" },
    { id: CategoryFilter.Popular, name: "Популярные", icon: "star" },
    { id: CategoryFilter.New, name: "Новые", icon: "time" },
    { id: CategoryFilter.Discount, name: "Со скидкой", icon: "pricetag" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || DEFAULT_COORDINATES.latitude,
          longitude:
            location?.coords.longitude || DEFAULT_COORDINATES.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        onMapReady={() => setMapReady(true)}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {(() => {
          const partner = partners.find(({ id }) => selectedMarkerId === id);

          if (!partner) return;

          return (
            <Marker
              coordinate={partner.coords}
              title={partner.name}
              description="Место получения заказа"
            />
          );
        })()}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker.id)}
            tracksViewChanges={false}
          >
            <View
              style={[
                styles.markerContainer,
                selectedMarkerId === marker.id && styles.selectedMarker,
              ]}
            >
              {/* <Text style={styles.markerPrice}>{marker.price}₸</Text> */}
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.partner.name}</Text>
                <Text style={styles.calloutAddress}>
                  {marker.partner.address}
                </Text>
                <View style={styles.calloutRating}>
                  <Ionicons name="star" size={14} color="#FFC107" />
                  <Text style={styles.calloutRatingText}>
                    {marker.partner.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Animated.View style={styles.header} entering={FadeIn.duration(300)}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => {
            if (location?.coords) {
              mapRef.current?.animateToRegion(
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                },
                500
              );
            }
          }}
        >
          <Ionicons name="locate" size={22} color="#333" />
        </TouchableOpacity>

        {showSearch ? (
          <Animated.View
            style={styles.searchExpanded}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <View style={styles.searchInputWrapper}>
              <Ionicons
                name="search"
                size={20}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Найти заведение"
                style={styles.searchInputExpanded}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  // Apply search
                  handleFilterChange(activeFilter);
                }}
              />
              <TouchableOpacity
                style={styles.searchClear}
                onPress={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                  handleFilterChange(activeFilter);
                  Keyboard.dismiss();
                }}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Pressable
            style={styles.searchCollapsed}
            onPress={() => setShowSearch(true)}
          >
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>Найти заведение</Text>
          </Pressable>
        )}

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            if (user) {
              router.push("/(tabs)/profile");
            } else {
              router.push("/(auth)/login");
            }
          }}
        >
          <Ionicons
            name={user ? "person" : "person-outline"}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterItem,
                activeFilter === category.id && styles.filterItemActive,
              ]}
              onPress={() => handleFilterChange(category.id as CategoryFilter)}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={activeFilter === category.id ? "#fff" : "#333"}
              />
              <Text
                style={[
                  styles.filterText,
                  activeFilter === category.id && styles.filterTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>
      )}

      {!isLoading && filteredPartners.length > 0 && (
        <Animated.View
          style={styles.carouselWrapper}
          entering={SlideInDown.duration(500)}
        >
          <ReanimatedCarousel
            ref={carouselRef}
            data={filteredPartners}
            renderItem={({ item }) => (
              <PartnerCard key={item.id} partner={item} />
            )}
            onScrollEnd={(index) => handleCarouselItemChange(index)}
            height={260}
            width={screenWidth}
            style={{ width: screenWidth }}
            loop={false}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            snapEnabled
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f2efe9", // OSM background color
  },

  // Header styles
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  // Search styles
  searchCollapsed: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    paddingLeft: 12,
    paddingRight: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  searchExpanded: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInputExpanded: {
    flex: 1,
    height: 40,
    padding: 0,
    fontSize: 16,
  },
  searchPlaceholder: {
    flex: 1,
    color: "#999",
    fontSize: 16,
  },
  searchClear: {
    padding: 4,
  },

  // Filter styles
  filterContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 90,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  filterItemActive: {
    backgroundColor: "#2ecc71",
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
  },

  // Marker styles
  markerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
  },
  selectedMarker: {
    backgroundColor: "#2ecc71",
    transform: [{ scale: 1.1 }],
  },
  markerPrice: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
  },
  calloutContainer: {
    width: 150,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  calloutRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  calloutRatingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },

  // Carousel styles
  carouselWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  // Loading state
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});
