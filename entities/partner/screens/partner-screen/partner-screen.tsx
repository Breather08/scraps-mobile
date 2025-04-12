import { Text, Pressable, View, Image, ImageBackground } from "react-native";
import { usePartner } from "../../providers/partners-provider";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { format as formatDate } from "date-fns/format";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useCallback, useState, useEffect } from "react";
import OrderCounter from "../../components/order-counter";
import { formatNumber } from "@/utils/number";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBackdrop from "@/components/backdrop";
import OrderAmountInput from "../../components/order-amount-input";
import Button from "@/components/button";

export default function PartnerScreen() {
  const { partner } = usePartner();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  function renderSchedule() {
    if (!partner) return "";

    const timeStart = formatDate(partner.workStartAt, "HH:mm");
    const timeEnd = formatDate(partner.workEndAt, "HH:mm");

    return `${timeStart} - ${timeEnd}`;
  }

  return (
    partner && (
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: partner?.backgroundUrl }}
              style={styles.image}
              resizeMode="cover"
            />

            <ImageBackground
              source={{ uri: partner?.backgroundUrl }}
              resizeMode="cover"
            ></ImageBackground>

            <View style={styles.buttonsContainer}>
              <Pressable
                style={styles.iconButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="heart-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{partner.name}</Text>
            <Text style={styles.rating}>⭐ {partner.rating}</Text>

            <View style={styles.separator} />

            <View style={styles.row}>
              <Ionicons name="location-outline" size={20} color="black" />
              <Text style={styles.text}>{partner.address}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={20} color="black" />
              <Text style={styles.boldText}>{renderSchedule()}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="pricetag-outline" size={20} color="black" />
              <Text style={styles.boldText}>
                {formatNumber(partner.price, { suffix: "₸" })}
              </Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Что входит в Magic Box?</Text>
            <Text style={styles.text}>
              🍕 В этом боксе вы получите 6-8 кусочков вкусной пиццы от Papa
              Johns весом около 500 г.
            </Text>
            <Text style={styles.text}>
              🔥 Обычно в коробке бывают популярные вкусы: Пепперони, Четыре
              сыра, Гавайская.
            </Text>
            <Text style={styles.text}>
              📦 Состав может отличаться, но качество всегда на высоте!
            </Text>
          </View>
          <Button onPress={handlePresentModalPress}>
            <Text style={styles.ctaText}>Забрать Magic Box!</Text>
            <Text style={styles.ctaCaption}>Осталось 5 боксов</Text>
          </Button>
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              containerStyle={{
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <BottomSheetView style={styles.contentContainer}>
                <OrderAmountInput partner={partner} />
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    )
  );
}
