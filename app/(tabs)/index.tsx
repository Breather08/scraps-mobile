import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import Animated from "react-native-reanimated";
import { Partner } from "@/entities/partner/types";
import { fetchPartners } from "@/entities/partner/api";
import PartnerCard from "@/entities/partner/components/partner-card";
import Carousel from "@/components/carousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedCarousel from "react-native-reanimated-carousel";

export default function MapScreen() {
  const DEFAULT_COORDINATES = { latitude: 51.1694, longitude: 71.4491 };
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const mapRef = useRef<MapView>(null);

  async function getLocation() {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const currentLocation = await getCurrentPositionAsync();
    setLocation(currentLocation);
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  }

  useEffect(() => {
    getLocation();
    makePartnersRequest();
  }, []);

  const [partners, setPartners] = useState<Partner[]>([]);
  async function makePartnersRequest() {
    const response = await fetchPartners();

    setPartners(response);
  }

  const { width: screenWidth } = Dimensions.get("window");

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || DEFAULT_COORDINATES.latitude,
          longitude:
            location?.coords.longitude || DEFAULT_COORDINATES.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && <Marker coordinate={location.coords}></Marker>}
      </MapView>
      <View style={styles.searchWrapper}>
        <TextInput placeholder="Найти заведение" style={styles.searchInput} />
      </View>
      <View style={styles.carouselWrapper}>
        <ReanimatedCarousel
          data={partners}
          renderItem={({ item }) => (
            <PartnerCard key={item.name} partner={item} />
          )}
          height={300}
          loop={false}
          width={screenWidth}
          style={{ width: screenWidth }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchWrapper: {
    padding: 16,
    width: "100%",
    position: "absolute",
    top: 40,
  },
  carouselWrapper: {
    position: "absolute",
    bottom: 0,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    height: 44,
    paddingLeft: 12,

    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  partners: {
    position: "absolute",
    bottom: 20,
  },
});
