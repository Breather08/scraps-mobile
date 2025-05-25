import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Partner } from "../../types";
import { formatNumber } from "@/utils/number";
import { router } from "expo-router";
import { usePartner } from "../../providers/partners-provider";
import { format as formatDate } from "date-fns/format";
import { LinearGradient } from 'expo-linear-gradient'
import { setFavoritePartner } from "@/entities/favorites/api";

interface PartnerCardProps {
  partner: Partner;
  onToggleFavorite?: (partnerId: string) => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onToggleFavorite }) => {
  const { setPartner } = usePartner();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get collection time from work hours
  const collectionTimeStart = formatDate(partner.workStartAt, "h:mm a");
  const collectionTimeEnd = formatDate(partner.workEndAt, "h:mm a");
  
  const toggleFavorite = async (partnerId: string) => {
    setIsLoading(true);
    await setFavoritePartner(partnerId);
    setIsLoading(false);
  };

  
  // Determine business category (hardcoded for now, since Partner type doesn't have a category field)
  const categories = ["Dessert", "Bakery"];
  
  // Calculate review count (placeholder based on rating)
  const reviewCount = Math.floor(partner.rating * 40);
  
  // Convert distance to miles for display (the image shows miles)
  const distanceInMiles = partner.distance ? (partner.distance * 0.621371).toFixed(1) : "0.6";
  
  return (
    <Pressable
      onPress={() => {
        setPartner(partner);
        router.navigate(`/partner/${partner.id}`);
      }}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: partner.backgroundUrl || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=500' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.favoriteIcon}
            activeOpacity={0.7}
            onPress={() => onToggleFavorite && onToggleFavorite(partner.id)}
          >
            <MaterialCommunityIcons
              name={partner.isFavorite ? "heart" : "heart-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>

        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.titleSection}>
          <Text style={styles.name} numberOfLines={1}>{partner.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.distance}>{distanceInMiles} mi</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.categories}>{categories.join(", ")}</Text>
          </View>
        </LinearGradient>
        </View>


        <View style={styles.details}>
          <View style={styles.infoRow}>
            <View style={styles.collectionContainer}>
              <View style={styles.dotIndicator} />
              <Text style={styles.collectionLabel}>Collection {collectionTimeStart} - {collectionTimeEnd}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>{partner.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({reviewCount})</Text>
            </View>
          </View>
          
          {/* <Text style={styles.mealsSaved}>{formatNumber(mealsSaved, { precision: 0 })} meals saved</Text> */}
        </View>
      </View>
    </Pressable>
  );
};

export default PartnerCard;
