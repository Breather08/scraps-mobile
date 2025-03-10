import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For icons
import styles from "./styles";
import { Partner } from "../../types";
import { formatNumber } from "@/utils/number";
import { router } from "expo-router";
import { usePartner } from "../../providers/partners-provider";

interface PartnerCardProps {
  partner: Partner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const { setPartner } = usePartner();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setPartner(partner);
        router.push(`/partners/${partner.id}`);
      }}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: partner.backgroundUrl }} style={styles.image} />
          <Image source={{ uri: partner.logoUrl }} style={styles.logo} />
          <TouchableOpacity style={styles.favoriteIcon}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text className="text-3xl">{partner.name}</Text>
            <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>{partner.rating}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#555"
            />
            <Text style={styles.boldText}>Oggi</Text>
            <Text style={styles.time}>10:00 - 22:00</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={16}
              color="#555"
            />
            <Text style={styles.distance}>{partner.distance} da te!</Text>
          </View>

          <View style={styles.priceSection}>
            <TouchableOpacity style={styles.cartButton}>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={16}
                color="white"
              />
              <Text style={styles.cartText}>1</Text>
            </TouchableOpacity>
            <View style={styles.priceTag}>
              <Text style={styles.price}>
                {formatNumber(partner.price, {
                  suffix: "₸",
                  precision: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PartnerCard;
