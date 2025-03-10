import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { usePartner } from "@/entities/partner/providers/partners-provider";
import { useEffect, useRef, useState } from "react";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import CurrentLocationMarker from "@/entities/map/components/current-location-marker";
import { Ionicons } from "@expo/vector-icons";
import Island from "@/components/island";
import Informer from "@/components/informer";
import { formatNumber } from "@/utils/number";
import Button from "@/components/button";

export default function CheckoutScreen() {
  const mapRef = useRef<MapView>(null);
  const { partner } = usePartner();
  const [userLocation, setLocation] = useState<LocationObject | null>(null);

  async function requestLocation() {
    if (!partner) return;

    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const currentLocation = await getCurrentPositionAsync();
    setLocation(currentLocation);

    mapRef.current?.fitToCoordinates([currentLocation.coords, partner.coords], {
      edgePadding: { top: 30, right: 10, bottom: 10, left: 10 },
      animated: true,
    });
  }

  useEffect(() => {
    requestLocation();
  }, []);

  function confirmOrder() {
    console.log("Order confirm");
  }

  return (
    partner && (
      <ScrollView>
        <View style={styles.container}>
          <Island topFlat>
            <Text style={styles.blockTitle}>Ваш заказ</Text>
            <Text>
              2 бокса из{" "}
              <Text style={{ fontWeight: "600" }}>{partner.name}</Text>
            </Text>
          </Island>
          <Island>
            <Text style={styles.blockTitle}>Детали заказа</Text>
            <View style={styles.mapWrapper}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: partner.coords.latitude,
                  longitude: partner.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                {userLocation?.coords && (
                  <CurrentLocationMarker coordinate={userLocation.coords} />
                )}
                <Marker coordinate={partner.coords} />
              </MapView>
            </View>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={20} color="black" />
              <Text>{partner.address}</Text>
            </View>
            <Informer
              variant="warning"
              caption={"Иначе заказ будет отменен"}
              title={"Заберите заказ до 23:00"}
            />
          </Island>
          <Island>
            <Text style={styles.blockTitle}>Способ оплаты</Text>
          </Island>
          <Island bottomFlat style={{ flex: 1 }}>
            <Text style={styles.blockTitle}>Итого</Text>
            <View style={styles.totalsRow}>
              <Text>Бокс x 2</Text>
              <Text>{formatNumber(3820, { suffix: "₸" })}</Text>
            </View>
            <Button onPress={confirmOrder}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Оплатить заказ
              </Text>
            </Button>
          </Island>
        </View>
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  informer: {},
  blockTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: 200,
  },
  row: {
    flexDirection: "row",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
