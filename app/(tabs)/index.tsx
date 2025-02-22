import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapView from "react-native-maps";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";

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
  }, []);

  return (
    <View style={styles.container}>
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
      />
    </View>
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
});
