import { View, Text, StyleSheet } from "react-native";

type InformerVariant = "success" | "warning" | "error";

interface InformerProps {
  variant?: InformerVariant;
  caption?: string | React.ReactNode;
  title: string | React.ReactNode;
}

const BG: Record<InformerVariant, string> = Object.freeze({
  success: "green",
  warning: "orange",
  error: "red",
});

export default function Informer({
  title,
  caption = "",
  variant = "success",
}: InformerProps) {
  return (
    <View style={{ ...styles.informer, backgroundColor: BG[variant] }}>
      <Text style={styles.title}>{title}</Text>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  informer: {
    borderRadius: 16,
    gap: 2,
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  caption: {
    color: "#fff",
    fontSize: 12,
  },
});
