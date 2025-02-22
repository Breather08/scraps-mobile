import { View, Text } from "react-native";
import { usePartner } from "../providers/partners-provider";

export default function PartnerScreen() {
  const { partner } = usePartner();

  return (
    <View>
      <Text>Partner Screen: {partner?.name}</Text>
    </View>
  );
}
