import { View, Text, Pressable } from "react-native";
import OrderCounter from "../order-counter";
import { formatNumber } from "@/utils/number";
import { useState } from "react";
import { Partner } from "../../types";
import { Separator } from "@/components/separator";
import styles from "./styles";
import Button from "@/components/button";
import { router } from "expo-router";

export interface OrderAmountInputProps {
  partner: Partner;
}

export default function OrderAmountInput({ partner }: OrderAmountInputProps) {
  const [boxAmount, setBoxAmount] = useState(0);
  const availableBoxes = 5; // TODO: Get from partners

  function proceed() {
    router.push(`/partners/${partner.id}/checkout`);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Koличecтвo боксов</Text>
      <Separator spacing={24} />
      <OrderCounter
        min={1}
        max={availableBoxes}
        onChange={(num) => setBoxAmount(num)}
      />
      <Text style={styles.available}>Доступно: {availableBoxes}</Text>
      <Separator spacing={24} />
      <Button onPress={proceed}>
        <Text style={styles.btn}>
          К оплате {formatNumber(boxAmount * partner.price, { suffix: "₸" })}
        </Text>
      </Button>
    </View>
  );
}
