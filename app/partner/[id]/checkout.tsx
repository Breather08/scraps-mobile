import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions, Platform } from "react-native";
import MapView, { Marker, Polyline, UrlTile, MapViewProps } from "react-native-maps";
import { usePartner } from "@/entities/partner/providers/partners-provider";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync
} from "expo-location";
import CurrentLocationMarker from "@/entities/map/components/current-location-marker";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Island from "@/components/island";
import Informer from "@/components/informer";
import { formatNumber } from "@/utils/number";
import Button from "@/components/ui/button";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

type PaymentMethod = "card" | "cash" | "applePay" | "googlePay";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutScreen() {
  const mapRef = useRef<MapView>(null);
  const { partner } = usePartner();
  const { user } = useAuth();
  const [userLocation, setLocation] = useState<LocationObject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");

  // Get parameters from the route
  const params = useLocalSearchParams();
  const boxType = params.boxType as string || 'standard';
  const boxName = params.boxName as string || 'Стандартный';
  const boxPrice = Number(params.boxPrice as string) || 0;
  const boxQuantity = Number(params.boxQuantity as string) || 1;
  const boxDescription = params.boxDescription as string || '';

  // Create items array from route params instead of mock data
  const [items, setItems] = useState<CheckoutItem[]>([
    { id: boxType, name: boxName, price: boxPrice, quantity: boxQuantity }
  ]);

  const [route, setRoute] = useState<{ points: { latitude: number, longitude: number }[], distance: number, duration: number } | null>(null);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Free delivery
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + deliveryFee + serviceFee;

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Calculate distance between user and partner location
  const distanceInfo = useMemo(() => {
    if (!userLocation?.coords || !partner) return null;

    // Calculate direct distance in meters
    const distanceMeters = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      partner.coords.latitude,
      partner.coords.longitude
    );

    // Convert to kilometers with 1 decimal place
    const distance = Math.round(distanceMeters / 100) / 10;

    // Estimate walking time (average walking speed 5km/h)
    const walkingMinutes = Math.round((distanceMeters / 1000) / 5 * 60);

    // Estimate driving time (average urban driving speed 30km/h)
    const drivingMinutes = Math.round((distanceMeters / 1000) / 30 * 60);

    return { distance, walkingMinutes, drivingMinutes };
  }, [userLocation, partner]);

  // Simulate a route between two points
  function generateRoute(start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }) {
    if (!start || !end) return null;

    // Create a simple line with slight curve for more realistic appearance
    const points = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;

      // Linear interpolation between points
      const lat = start.latitude + (end.latitude - start.latitude) * ratio;
      const lng = start.longitude + (end.longitude - start.longitude) * ratio;

      // Add slight curve if not start or end point
      const curveAmount = 0.0003; // Adjust for curve intensity
      const curve = i > 0 && i < steps ? Math.sin(ratio * Math.PI) * curveAmount : 0;

      points.push({
        latitude: lat + curve,
        longitude: lng - curve,
      });
    }

    return {
      points,
      // Using the same distance we calculated above
      distance: distanceInfo?.distance || 0,
      // Using the time estimate calculated above
      duration: distanceInfo?.drivingMinutes || 0
    };
  }

  async function requestLocation() {
    if (!partner) return;

    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Доступ к местоположению",
        "Для определения маршрута требуется доступ к вашему местоположению",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const currentLocation = await getCurrentPositionAsync({
        accuracy: Platform.OS === 'ios' ? 6 : 4, // Balanced accuracy
      });

      setLocation(currentLocation);

      // Generate route between user and partner locations
      if (partner && currentLocation) {
        const routeData = generateRoute(
          currentLocation.coords,
          partner.coords
        );
        setRoute(routeData);
      }

      // Fit map to show both markers and the route
      mapRef.current?.fitToCoordinates([currentLocation.coords, partner.coords], {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Ошибка", "Не удалось определить ваше местоположение");
    }
  }

  useEffect(() => {
    requestLocation();
  }, []);

  function updateQuantity(id: string, newQuantity: number) {
    if (newQuantity < 1) return;

    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  }

  async function confirmOrder() {
    if (!partner || !user || isProcessing) return;

    // Check if quantity is valid
    if (boxQuantity <= 0) {
      Alert.alert("Ошибка", "Пожалуйста, выберите количество боксов.");
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Order success
      setOrderSuccess(true);

      // Show success alert
      Alert.alert(
        "Заказ оформлен",
        "Ваш заказ успешно оформлен. Вы можете отслеживать статус в разделе 'История заказов'.",
        [{
          text: "OK",
          onPress: () => {
            // Navigate back to main screen
            router.replace("/(tabs)/partners");
          }
        }]
      );
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось оформить заказ. Пожалуйста, попробуйте позже.");
    } finally {
      setIsProcessing(false);
    }
  }

  const PaymentMethodItem = ({ method, title, icon, selected }: { method: PaymentMethod, title: string, icon: string, selected: boolean }) => (
    <TouchableOpacity
      style={[styles.paymentMethod, selected && styles.paymentMethodSelected]}
      onPress={() => setSelectedPayment(method)}
    >
      <MaterialCommunityIcons name={icon as any} size={24} color={selected ? "#2ecc71" : "#555"} />
      <Text style={[styles.paymentMethodText, selected && styles.paymentMethodTextSelected]}>{title}</Text>
      {selected && (
        <View style={styles.checkmark}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#2ecc71" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (!partner) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Загрузка информации...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Island topFlat>
            <Text style={styles.blockTitle}>Ваш заказ</Text>
            <View style={styles.orderInfo}>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemPrice}>
                      {formatNumber(item.price, { suffix: "₸" })}
                    </Text>
                  </View>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
              ))}
              <Text style={styles.partnerName}>
                Из <Text style={{ fontWeight: "600" }}>{partner.name}</Text>
              </Text>
            </View>
          </Island>

          <Island>
            <Text style={styles.blockTitle}>Детали заказа</Text>

            {/* Map section with route */}
            <View style={[styles.mapWrapper]}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: partner.coords.latitude,
                  longitude: partner.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                toolbarEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
                pitchEnabled={false}
                moveOnMarkerPress={false}
                liteMode={true}
              >
                {/* OpenStreetMap Tile Layer */}
                <UrlTile
                  urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />

                {userLocation?.coords && (
                  <CurrentLocationMarker coordinate={userLocation.coords} />
                )}

                <Marker
                  coordinate={partner.coords}
                  title={partner.name}
                  description="Место получения заказа"
                />

                {/* Route polyline */}
                {route && route.points && (
                  <Polyline
                    coordinates={route.points}
                    strokeWidth={4}
                    strokeColor="#2ecc71"
                    lineDashPattern={[1]}
                  />
                )}
              </MapView>
            </View>

            {/* Route info section */}
            {distanceInfo && (
              <View style={styles.routeInfoContainer}>
                <View style={styles.distanceInfo}>
                  <View style={styles.distanceInfoItem}>
                    <FontAwesome5 name="walking" size={18} color="#555" />
                    <Text style={styles.distanceInfoText}>
                      {distanceInfo.walkingMinutes} мин
                    </Text>
                  </View>

                  <View style={styles.distanceInfoItem}>
                    <FontAwesome5 name="car" size={18} color="#555" />
                    <Text style={styles.distanceInfoText}>
                      {distanceInfo.drivingMinutes} мин
                    </Text>
                  </View>

                  <View style={styles.distanceInfoItem}>
                    <FontAwesome5 name="route" size={18} color="#555" />
                    <Text style={styles.distanceInfoText}>
                      {distanceInfo.distance} км
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="#333" />
              <Text style={styles.addressText}>{partner.address}</Text>
            </View>

            <Informer
              variant="warning"
              caption={"Иначе заказ будет отменен"}
              title={"Заберите заказ до 23:00"}
            />
          </Island>

          <Island>
            <Text style={styles.blockTitle}>Способ оплаты</Text>
            <View style={styles.paymentMethods}>
              <PaymentMethodItem
                method="card"
                title="Банковская карта"
                icon="credit-card-outline"
                selected={selectedPayment === "card"}
              />
              <PaymentMethodItem
                method="cash"
                title="Наличные при получении"
                icon="cash"
                selected={selectedPayment === "cash"}
              />
              <PaymentMethodItem
                method="applePay"
                title="Apple Pay"
                icon="apple"
                selected={selectedPayment === "applePay"}
              />
              <PaymentMethodItem
                method="googlePay"
                title="Google Pay"
                icon="google"
                selected={selectedPayment === "googlePay"}
              />
            </View>
          </Island>

          <Island bottomFlat>
            <Text style={styles.blockTitle}>Итого</Text>
            <View style={styles.totalsContainer}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Промежуточный итог</Text>
                <Text style={styles.totalsValue}>{formatNumber(subtotal, { suffix: "₸" })}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Доставка</Text>
                <Text style={styles.totalsValueFree}>Бесплатно</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Сервисный сбор</Text>
                <Text style={styles.totalsValue}>{formatNumber(serviceFee, { suffix: "₸" })}</Text>
              </View>
              <View style={[styles.totalsRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>К оплате</Text>
                <Text style={styles.totalValue}>{formatNumber(total, { suffix: "₸" })}</Text>
              </View>
            </View>

            <Button
              title={`Оформить заказ на ${formatNumber(total, { suffix: "₸" })}`}
              variant="primary"
              size="large"
              onPress={confirmOrder}
              disabled={isProcessing || items.length === 0}
              loading={isProcessing}
              fullWidth
            />
          </Island>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  orderInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 14,
    color: "#666",
  },
  partnerName: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  quantityText: {
    width: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  map: {
    width: "100%",
    height: 200,
    backgroundColor: "#f2efe9",
  },
  routeInfoContainer: {
    marginBottom: 16,
  },
  distanceInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 12,
  },
  distanceInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  distanceInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  paymentMethodSelected: {
    borderLeftWidth: 0,
    borderLeftColor: '#2ecc71',
  },
  paymentMethodText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  paymentMethodTextSelected: {
    color: '#2ecc71',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    right: 8,
  },
  totalsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalsLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalsValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalsValueFree: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2ecc71',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
});
