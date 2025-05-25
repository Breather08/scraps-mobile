import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface OrderCounterProps {
  max?: number;
  min?: number;
  onChange: (num: number) => void;
}

function OrderCounter({ max, min = 0, onChange }: OrderCounterProps) {
  const [count, setCount] = useState(min);

  useEffect(() => {
    onChange(count);
  }, [count]);

  function increment() {
    if (max && count === max) return;
    setCount(count + 1);
  }

  function decrement() {
    if (count === min) return;
    setCount(count - 1);
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[
          styles.btn,
          {
            backgroundColor: count === min ? "grey" : "#114D4D",
          },
        ]}
        onPress={decrement}
      >
        <MaterialCommunityIcons name="minus" size={22} color={"white"} />
      </Pressable>
      <Text style={styles.count}>{count}</Text>
      <Pressable
        style={[
          styles.btn,
          {
            backgroundColor: count === max ? "grey" : "#114D4D",
          },
        ]}
        onPress={increment}
      >
        <MaterialCommunityIcons name="plus" size={22} color={"white"} />
      </Pressable>
    </View>
  );
}

export default OrderCounter;
