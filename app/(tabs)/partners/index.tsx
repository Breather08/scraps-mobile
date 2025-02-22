import { usePartner } from "@/entities/partner/providers/partners-provider";
import PartnerScreen from "@/entities/partner/screens/partner-screen";
import PartnersListScreen from "@/entities/partner/screens/partners-list-screen";
import { Text, View } from "react-native";

export default function index() {
  return <PartnersListScreen />;
}
