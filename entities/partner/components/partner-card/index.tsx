import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { Partner } from "../../types";
import { formatNumber } from "@/utils/number";
import { router } from "expo-router";
import { usePartner } from "../../providers/partners-provider";
import { format as formatDate } from "date-fns/format";

interface PartnerCardProps {
  partner: Partner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const { setPartner } = usePartner();

  // Determine if partner is currently open
  const currentHour = new Date().getHours();
  const startHour = new Date(partner.workStartAt).getHours();
  const endHour = new Date(partner.workEndAt).getHours();
  const isOpen = currentHour >= startHour && currentHour < endHour;
  
  // Get the box count from the boxesInfo.total_available field
  const boxCount = partner.boxesInfo.total_available;
  
  // Determine available status based on the box count
  let availabilityStatus: 'available' | 'low' | 'sold-out' = 'available';
  if (boxCount <= 0) {
    availabilityStatus = 'sold-out';
  } else if (boxCount <= 3) {
    availabilityStatus = 'low';
  }
  
  function renderSchedule() {
    const timeStart = formatDate(partner.workStartAt, "HH:mm");
    const timeEnd = formatDate(partner.workEndAt, "HH:mm");

    return (
      <>
        <Text style={styles.time}>
          {timeStart} - {timeEnd}
        </Text>
        <View style={[styles.statusIndicator, isOpen ? styles.statusOpen : styles.statusClosed]}>
          <Text style={styles.statusText}>{isOpen ? 'Открыто' : 'Закрыто'}</Text>
        </View>
      </>
    );
  }

  return (
    <Pressable
      onPress={() => {
        setPartner(partner);
        router.navigate(`/partners/${partner.id}`);
      }}
      // style={({ pressed }) => [
      //   { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1 }
      // ]}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: partner.backgroundUrl || 'https://via.placeholder.com/400x200/f0f0f0/cccccc' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <Image 
            source={{ uri: partner.logoUrl || 'https://via.placeholder.com/80x40/ffffff/999999' }} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.favoriteIcon}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={22}
              color="#2ecc71"
            />
          </TouchableOpacity>
          
          {/* Mystery Boxes Count Badge */}
          <View style={[styles.boxesCountBadge, availabilityStatus === 'sold-out' && styles.noBoxesAvailable]}>
            <MaterialCommunityIcons
              name="package-variant"
              size={16}
              color="white"
            />
            <Text style={styles.boxesCountText}>
              {availabilityStatus === 'sold-out' ? 'Нет' : boxCount}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{partner.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
              <Text style={styles.rating}>{partner.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#555"
            />
            <Text style={styles.boldText}>Сегодня:</Text>
            {renderSchedule()}
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={18}
              color="#555"
            />
            <Text style={styles.distance}>
              <Text style={styles.boldText}>{partner.distance} км</Text> от вас
            </Text>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceTag}>
              <Ionicons
                name="pricetag"
                size={18}
                color="white"
              />
              <Text style={styles.price}>
                {formatNumber(partner.price, {
                  suffix: "₸",
                  precision: 0,
                })}
              </Text>
            </View>
            
            {/* Mystery Box Availability Indicator */}
            <View style={[styles.boxAvailability, availabilityStatus === 'sold-out' && styles.boxUnavailable]}>
              <MaterialCommunityIcons
                name="cube-outline"
                size={18}
                color={availabilityStatus === 'available' ? "#2ecc71" : "#ff6b6b"}
              />
              <Text style={[styles.boxAvailabilityText, availabilityStatus === 'sold-out' && styles.boxUnavailableText]}>
                {availabilityStatus === 'available' ? 'Доступно' : 'Нет боксов'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default PartnerCard;
