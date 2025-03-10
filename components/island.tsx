import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface IslandProps extends ViewProps {
  children: React.ReactNode | React.ReactNode[];
  topFlat?: boolean;
  bottomFlat?: boolean;
}

export default function Island({
  children,
  bottomFlat,
  topFlat,
  ...props
}: IslandProps) {
  return (
    <View
      {...props}
      style={[
        styles.island,
        props.style,
        {
          borderBottomLeftRadius: bottomFlat ? 0 : undefined,
          borderBottomRightRadius: bottomFlat ? 0 : undefined,
          borderTopLeftRadius: topFlat ? 0 : undefined,
          borderTopRightRadius: topFlat ? 0 : undefined,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
  },
});
