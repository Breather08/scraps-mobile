import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Partner } from "../../types";
import { FoodPackage } from "@/entities/food-package/types";
import { fetchPartnerById } from "../../api";
import { fetchBusinessPackages } from "@/entities/food-package/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PartnerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [packages, setPackages] = useState<FoodPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPartnerData() {
    if (!id) {
      setError("Partner ID is missing");
      setLoading(false);
      return;
    }

    const [partnerData, packagesData] = await Promise.all([
      fetchPartnerById(id as string),
      fetchBusinessPackages(id as string)
    ]);
    
    setPartner(partnerData);
    setPackages(packagesData);
    setLoading(false);
  }

  useEffect(() => {
    loadPartnerData();
  }, [id]);

  function handleReserve(packageId: string) {
    console.log(`Reserve package ${packageId}`);
    // Implementation would go here to handle the reservation
    // This would typically navigate to a checkout or confirmation screen
    // Navigate back to the partners list for now
    router.back();
    // In a real app, we would navigate to a reservation screen
    console.log(`Reserved package ${packageId}`);
  }

  function calculateDiscountPercentage(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Loading partner details...</Text>
      </View>
    );
  }

  if (error || !partner) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>
          {error || "Partner not found"}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ 
              uri: partner.backgroundUrl || "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            }}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        {/* Partner info section */}
        <View style={styles.partnerInfoContainer}>
          <View style={styles.partnerNameRating}>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{partner.rating}</Text>
              <Text style={styles.reviewCount}>({Math.floor(Math.random() * 500)})</Text>
            </View>
          </View>
          
          <Text style={styles.partnerDescription}>{partner.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialIcons name="location-on" size={20} color="#777" />
              <Text style={styles.detailText}>{partner.address}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="access-time" size={20} color="#777" />
              <Text style={styles.detailText}>
                Pickup: {partner.workStartAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {partner.workEndAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="food-takeout-box" size={20} color="#2ecc71" />
              <Text style={styles.savedMealsText}>
                {partner.mealsSaved?.toLocaleString() || "0"} meals saved
              </Text>
            </View>
          </View>
        </View>

        {/* Available packages section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Available packages</Text>
          
          {packages.length === 0 ? (
            <View style={styles.noPackagesContainer}>
              <MaterialCommunityIcons name="package-variant-closed" size={64} color="#e0e0e0" />
              <Text style={styles.noPackagesText}>No packages available at this time</Text>
            </View>
          ) : (
            packages.map((pkg) => {
              const discountPercentage = calculateDiscountPercentage(
                pkg.original_price,
                pkg.discounted_price
              );
              
              return (
                <View key={pkg.id} style={styles.packageContainer}>
                  {/* Discount badge */}
                  {discountPercentage > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
                    </View>
                  )}
                  
                  {/* Package image */}
                  <Image 
                    source={{ 
                      uri: pkg.image_url || "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    }} 
                    style={styles.packageImage}
                    resizeMode="cover"
                  />
                  
                  {/* Package details */}
                  <View style={styles.packageDetails}>
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    <Text style={styles.packageDescription}>{pkg.description}</Text>
                    
                    <View style={styles.priceReserveContainer}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>
                          ${pkg.original_price.toFixed(2)}
                        </Text>
                        <Text style={styles.discountedPrice}>
                          ${pkg.discounted_price.toFixed(2)}
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.reserveButton}
                        onPress={() => handleReserve(pkg.id)}
                      >
                        <Text style={styles.reserveButtonText}>Reserve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
        
        {/* Add padding at bottom for scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    width: "100%",
    height: 220,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerBackButton: {
    padding: 8,
  },
  partnerInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  partnerNameRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 16,
    color: "#777",
    marginLeft: 4,
  },
  partnerDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 8,
  },
  savedMealsText: {
    fontSize: 15,
    color: "#2ecc71",
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "white",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  packageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#ff9500",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    zIndex: 10,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  packageImage: {
    width: "100%",
    height: 200,
  },
  packageDetails: {
    padding: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  packageDescription: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  priceReserveContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: "column",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2ecc71",
  },
  reserveButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  reserveButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  noPackagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  noPackagesText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});