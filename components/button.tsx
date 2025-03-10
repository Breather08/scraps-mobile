import React from "react";
import { Pressable, StyleSheet } from "react-native";

export interface ButtonProps {
  children: React.ReactNode | React.ReactNode[];
  onPress: () => void;
}

export default function Button({ children, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    color: "#fff",
  },
});
