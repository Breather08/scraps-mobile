import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Button from "./ui/button";

export interface ButtonProps {
  children: React.ReactNode | React.ReactNode[];
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// This is a backward-compatible wrapper for the enhanced Button component
export default function LegacyButton({ children, onPress, disabled = false, style }: ButtonProps) {
  const composedStyle = style ? [styles.button, style] : styles.button;
  
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      variant="primary"
      style={composedStyle}
    >
      <View style={styles.innerContainer}>
        {children}
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#a8e6bc",
    opacity: 0.7,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  }
});
