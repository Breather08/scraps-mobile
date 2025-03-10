import { ColorValue, View } from "react-native";

export interface SeparatorProps {
  width?: number;
  spacing?: number;
  color?: ColorValue;
}

export function Separator({
  width = 1,
  color = "lightgrey",
  spacing = 8,
}: SeparatorProps) {
  return (
    <View
      style={{
        flex: 1,
        marginTop: spacing,
        marginBottom: spacing,
        alignSelf: "stretch",
        borderBottomColor: color,
        borderBottomWidth: width,
      }}
    />
  );
}
