import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export interface ButtonProps {
  children: React.ReactNode | React.ReactNode[];
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export default function Button({ children, onPress, disabled = false, style }: ButtonProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.innerContainer}>
        {children}
      </View>
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
  buttonDisabled: {
    backgroundColor: "#a8e6bc",
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: "#27ae60",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  }
});
